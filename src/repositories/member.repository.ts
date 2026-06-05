import { prisma } from "../config/prisma";
import {
  Member,
  RegisterMemberDTO,
  UpdateMemberDTO,
} from "../models/member.model";

export const createMemberRepository = async (
  data: RegisterMemberDTO,
): Promise<Member> => {
  return prisma.member.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      address: data.address || null,
      join_date: new Date(data.join_date),
      emergency_contact: data.emergency_contact,
      photo_url: data.photo_url || null,
      height: data.height || null,
      weight: data.weight || null,
      status: "pending",
      gym_id: data.gym_id,
      registration_fee: data.registration_fee,
    },
    include: {
      gym: true,
      plan: true,
    },
  });
};

export interface MemberFilters {
  search?: string;
  phone?: string;
  gym_id?: number;
  status?: string;
}

export const findAllMembersRepository = async (
  filters: MemberFilters,
): Promise<Member[]> => {
  const whereClause: any = {};

  if (filters.gym_id) {
    whereClause.gym_id = filters.gym_id;
  }

  if (filters.status) {
    whereClause.status = filters.status;
  }

  if (filters.phone) {
    whereClause.phone = { contains: filters.phone, mode: "insensitive" };
  }

  if (filters.search) {
    whereClause.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.member.findMany({
    where: whereClause,
    include: {
      gym: true,
      plan: true,
      payments: {
        orderBy: {
          due_date: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const findMemberByIdRepository = async (
  id: number,
): Promise<Member | null> => {
  return prisma.member.findUnique({
    where: { id },
    include: {
      gym: true,
      plan: true,
      payments: {
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });
};

export const updateMemberRepository = async (
  id: number,
  data: UpdateMemberDTO,
): Promise<Member | null> => {
  try {
    const updateData: any = { ...data };

    if (data.join_date) {
      updateData.join_date = new Date(data.join_date);
    }

    return await prisma.member.update({
      where: { id },
      data: updateData,
      include: {
        gym: true,
        plan: true,
      },
    });
  } catch (error) {
    return null;
  }
};

export const deleteMemberRepository = async (id: number): Promise<boolean> => {
  try {
    await prisma.member.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
};
