import * as memberRepository from '../repositories/member.repository';
import * as planRepository from '../repositories/plan.repository';
import * as gymRepository from '../repositories/gym.repository';
import { prisma } from '../config/prisma';
import { Member, RegisterMemberDTO, UpdateMemberDTO } from '../models/member.model';

export const registerMember = async (data: RegisterMemberDTO): Promise<Member> => {
  // Validate that the branch exists
  const gym = await gymRepository.findGymByIdRepository(data.gym_id);
  if (!gym) {
    throw new Error('Gym branch not found');
  }

  // Fetch plan details to calculate prices and due dates
  const plan = await planRepository.findPlanByIdRepository(data.plan_id);
  if (!plan) {
    throw new Error('Membership plan not found');
  }

  // Calculate membership expiration/payment due date
  const joinDate = new Date(data.join_date);
  const dueDate = new Date(joinDate);
  dueDate.setMonth(dueDate.getMonth() + plan.duration_months);

  // Execute in a transaction so member and initial payment are created together atomicly
  return prisma.$transaction(async (tx) => {
    // 1. Create member
    const member = await tx.member.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        join_date: joinDate,
        emergency_contact: data.emergency_contact,
        photo_url: data.photo_url || null,
        height: data.height || null,
        weight: data.weight || null,
        status: 'active',
        gym_id: data.gym_id,
        plan_id: data.plan_id,
      },
      include: {
        gym: true,
        plan: true,
      },
    });

    // 2. Automatically generate the initial unpaid payment record matching the selected plan price
    await tx.payment.create({
      data: {
        member_id: member.id,
        amount_paid: 0.00,
        amount_pending: plan.price,
        due_date: dueDate,
        payment_status: 'unpaid',
      },
    });

    return member;
  });
};

export const getAllMembers = async (filters: memberRepository.MemberFilters): Promise<Member[]> => {
  return memberRepository.findAllMembersRepository(filters);
};

export const getMemberById = async (id: number): Promise<Member | null> => {
  return memberRepository.findMemberByIdRepository(id);
};

export const updateMember = async (id: number, data: UpdateMemberDTO): Promise<Member | null> => {
  const existing = await memberRepository.findMemberByIdRepository(id);
  if (!existing) return null;

  // If plan is updated, we may want to adjust membership parameters, but standard field update is fine
  return memberRepository.updateMemberRepository(id, data);
};

export const deleteMember = async (id: number): Promise<boolean> => {
  const existing = await memberRepository.findMemberByIdRepository(id);
  if (!existing) return false;
  return memberRepository.deleteMemberRepository(id);
};
