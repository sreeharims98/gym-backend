import * as paymentRepository from '../repositories/payment.repository';
import * as memberRepository from '../repositories/member.repository';
import * as planRepository from '../repositories/plan.repository';
import { prisma } from '../config/prisma';
import { Payment, RecordPaymentDTO, RenewMembershipDTO } from '../models/payment.model';

export const recordPayment = async (id: number, data: RecordPaymentDTO): Promise<any> => {
  const payment = await paymentRepository.findPaymentByIdRepository(id);
  if (!payment) {
    throw new Error('Payment record not found');
  }

  const originalPending = Number(payment.amount_pending);
  const originalPaid = Number(payment.amount_paid);
  const totalAmount = originalPending + originalPaid;

  const newPaid = originalPaid + data.amount_paid;
  const newPending = Math.max(0, totalAmount - newPaid);

  let status = 'unpaid';
  if (newPending <= 0) {
    status = 'paid';
  } else if (newPaid > 0) {
    status = 'partial';
  }

  const updatedPayment = await paymentRepository.updatePaymentRepository(id, {
    amount_paid: newPaid,
    amount_pending: newPending,
    payment_status: status,
    payment_date: new Date(),
  });

  // If marked paid, let's automatically ensure the member status is active
  if (status === 'paid') {
    await memberRepository.updateMemberRepository(payment.member_id, {
      status: 'active',
    });
  }

  return updatedPayment;
};

export const renewMembership = async (memberId: number, data: RenewMembershipDTO): Promise<any> => {
  const member = await memberRepository.findMemberByIdRepository(memberId);
  if (!member) {
    throw new Error('Member not found');
  }

  const plan = await planRepository.findPlanByIdRepository(data.plan_id);
  if (!plan) {
    throw new Error('Membership plan not found');
  }

  // Calculate new due date (from now or selected date)
  const baseDate = data.payment_date ? new Date(data.payment_date) : new Date();
  const dueDate = new Date(baseDate);
  dueDate.setMonth(dueDate.getMonth() + plan.duration_months);

  return prisma.$transaction(async (tx) => {
    // 1. Update member's plan and reset their status to active
    await tx.member.update({
      where: { id: memberId },
      data: {
        plan_id: data.plan_id,
        status: 'active',
      },
    });

    // 2. Create the new invoice
    const newPayment = await tx.payment.create({
      data: {
        member_id: memberId,
        amount_paid: 0.00,
        amount_pending: plan.price,
        due_date: dueDate,
        payment_status: 'unpaid',
      },
      include: {
        member: {
          include: {
            gym: true,
            plan: true,
          },
        },
      },
    });

    return newPayment;
  });
};

export const generateWhatsAppLink = (phone: string, name: string, amount: number, dueDate: Date, gymName: string): string => {
  const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  // Format phone to clean international format (remove non-digits, ensure country code prefix if needed)
  let cleanPhone = phone.replace(/\D/g, '');
  // Default to standard prefix if not started with country code
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone; // Default to India country code if 10 digits, since context is Chennai/Bangalore/etc.
  }

  const text = `Hi ${name}, this is a friendly reminder from ${gymName} gym branch. Your membership fee of ₹${amount.toFixed(2)} is due on ${formattedDate}. Please renew your membership to continue your workouts smoothly. Thank you!`;
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

export const getOverdueDashboard = async (gymId?: number): Promise<any> => {
  const unpaidPayments = await paymentRepository.findUnpaidPaymentsRepository(gymId);
  const now = new Date();
  
  // Set times to start/end of day for precise date boundary checks
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  const endOfWeek = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

  const dueToday: any[] = [];
  const dueThisWeek: any[] = [];
  const overdue: any[] = [];

  unpaidPayments.forEach((payment) => {
    const dueDate = new Date(payment.due_date);
    
    // Construct premium metadata
    const name = payment.member.name;
    const phone = payment.member.phone;
    const amount = Number(payment.amount_pending);
    const gymName = payment.member.gym.name;
    
    const whatsappLink = generateWhatsAppLink(phone, name, amount, dueDate, gymName);

    const paymentInfo = {
      id: payment.id,
      member_id: payment.member_id,
      member_name: name,
      member_phone: phone,
      gym_branch: gymName,
      plan_name: payment.member.plan.name,
      amount_pending: amount,
      due_date: payment.due_date,
      payment_status: payment.payment_status,
      whatsapp_link: whatsappLink,
      days_delayed: 0,
      color_indicator: 'yellow',
    };

    if (dueDate < startOfToday) {
      // Overdue
      const diffTime = Math.abs(startOfToday.getTime() - dueDate.getTime());
      paymentInfo.days_delayed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      paymentInfo.color_indicator = 'red';
      overdue.push(paymentInfo);
    } else if (dueDate >= startOfToday && dueDate <= endOfToday) {
      // Due Today
      paymentInfo.color_indicator = 'yellow';
      dueToday.push(paymentInfo);
    } else if (dueDate > endOfToday && dueDate <= endOfWeek) {
      // Due This Week
      paymentInfo.color_indicator = 'yellow';
      dueThisWeek.push(paymentInfo);
    }
  });

  return {
    due_today: dueToday,
    due_this_week: dueThisWeek,
    overdue: overdue,
  };
};

export const getPaymentStats = async (gymId?: number) => {
  return paymentRepository.getSystemWideStatsRepository(gymId);
};

export const getWhatsAppReminderPayload = async (paymentId: number): Promise<{ text: string; link: string }> => {
  const payment = await paymentRepository.findPaymentByIdRepository(paymentId);
  if (!payment) {
    throw new Error('Payment record not found');
  }

  const name = payment.member.name;
  const phone = payment.member.phone;
  const amount = Number(payment.amount_pending);
  const gymName = payment.member.gym.name;
  const dueDate = payment.due_date;

  const formattedDate = new Date(dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  const text = `Hi ${name}, this is a friendly reminder from ${gymName} gym branch. Your membership fee of ₹${amount.toFixed(2)} is due on ${formattedDate}. Please renew your membership to continue your workouts smoothly. Thank you!`;
  const link = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;

  return { text, link };
};
