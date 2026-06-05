import { prisma } from "../config/prisma";
import { Payment } from "../models/payment.model";

export const findPaymentByIdRepository = async (id: number): Promise<any> => {
  return prisma.payment.findUnique({
    where: { id },
    include: {
      member: {
        include: {
          gym: true,
          plan: true,
        },
      },
    },
  });
};

export const createPaymentRepository = async (data: {
  member_id: number;
  amount_paid: number;
  amount_pending: number;
  due_date: Date;
  payment_status: string;
}): Promise<Payment> => {
  return prisma.payment.create({
    data,
  });
};

export const findUnpaidPaymentsRepository = async (
  gymId?: number,
): Promise<any[]> => {
  const whereClause: any = {
    payment_status: { in: ["unpaid", "partial"] },
  };

  if (gymId) {
    whereClause.member = { gym_id: gymId };
  }

  return prisma.payment.findMany({
    where: whereClause,
    include: {
      member: {
        include: {
          gym: true,
          plan: true,
        },
      },
    },
    orderBy: {
      due_date: "asc",
    },
  });
};

export const getSystemWideStatsRepository = async (
  gymId?: number,
): Promise<any> => {
  const paymentWhere: any = {};
  const memberWhere: any = {};

  if (gymId) {
    paymentWhere.member = { gym_id: gymId };
    memberWhere.gym_id = gymId;
  }

  // 1. Sum up collected and pending amounts
  const aggregations = await prisma.payment.aggregate({
    where: paymentWhere,
    _sum: {
      amount_paid: true,
      amount_pending: true,
    },
  });

  // 2. Count members
  const totalMembers = await prisma.member.count({ where: memberWhere });
  const activeMembers = await prisma.member.count({
    where: {
      ...memberWhere,
      status: "active",
    },
  });
  const expiredMembers = await prisma.member.count({
    where: {
      ...memberWhere,
      status: "expired",
    },
  });

  // 3. Count overdue payments
  const overdueCount = await prisma.payment.count({
    where: {
      ...paymentWhere,
      payment_status: { in: ["unpaid", "partial"] },
      due_date: { lt: new Date() },
    },
  });

  // 4. Branch revenue summary
  const branchRevenueRaw = await prisma.payment.findMany({
    where: {
      payment_status: { in: ["paid", "partial"] },
    },
    select: {
      amount_paid: true,
      member: {
        select: {
          gym_id: true,
          gym: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  // Roll up branch revenues
  const branchRevenuesMap: Record<number, { name: string; collected: number }> =
    {};
  branchRevenueRaw.forEach((row) => {
    if (row.member && row.member.gym) {
      const gId = row.member.gym_id;
      const gName = row.member.gym.name;
      const val = Number(row.amount_paid);

      if (!branchRevenuesMap[gId]) {
        branchRevenuesMap[gId] = { name: gName, collected: 0 };
      }
      branchRevenuesMap[gId].collected += val;
    }
  });

  const branchRevenues = Object.entries(branchRevenuesMap).map(
    ([id, item]) => ({
      gym_id: parseInt(id, 10),
      name: item.name,
      collected: item.collected,
    }),
  );

  return {
    total_collected: Number(aggregations._sum.amount_paid || 0),
    total_pending: Number(aggregations._sum.amount_pending || 0),
    total_members: totalMembers,
    active_members: activeMembers,
    expired_members: expiredMembers,
    overdue_count: overdueCount,
    branch_revenues: branchRevenues,
  };
};
