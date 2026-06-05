import * as memberRepository from "../repositories/member.repository";
import * as planRepository from "../repositories/plan.repository";
import * as gymRepository from "../repositories/gym.repository";
import { prisma } from "../config/prisma";
import {
  Member,
  RegisterMemberDTO,
  UpdateMemberDTO,
  AssignPlanDTO,
} from "../models/member.model";

export const registerMember = async (
  data: RegisterMemberDTO,
): Promise<Member> => {
  // Validate that the branch exists
  const gym = await gymRepository.findGymByIdRepository(data.gym_id);
  if (!gym) {
    throw new Error("Gym branch not found");
  }

  // Determine the registration fee to charge (override vs branch default)
  const registrationFee = data.registration_fee !== undefined ? data.registration_fee : Number(gym.registration_fee);

  const joinDate = new Date(data.join_date);

  return prisma.$transaction(async (tx) => {
    // Create member with pending status
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
        status: "pending",
        gym_id: data.gym_id,
        registration_fee: registrationFee,
      },
      include: {
        gym: true,
        plan: true,
      },
    });

    // Create the registration fee payment record (fully paid) if registration fee > 0
    if (registrationFee > 0) {
      await tx.payment.create({
        data: {
          member_id: member.id,
          amount_paid: registrationFee,
          amount_pending: 0.0,
          due_date: joinDate,
          payment_status: "paid",
          payment_date: joinDate,
          payment_type: "registration",
        },
      });
    }

    return member;
  });
};

export const getAllMembers = async (
  filters: memberRepository.MemberFilters,
): Promise<Member[]> => {
  return memberRepository.findAllMembersRepository(filters);
};

export const getMemberById = async (id: number): Promise<Member | null> => {
  return memberRepository.findMemberByIdRepository(id);
};

export const updateMember = async (
  id: number,
  data: UpdateMemberDTO,
): Promise<Member | null> => {
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

export const assignPlanToMember = async (
  memberId: number,
  data: AssignPlanDTO,
): Promise<Member> => {
  const member = await memberRepository.findMemberByIdRepository(memberId);
  if (!member) {
    throw new Error("Member not found");
  }

  const plan = await planRepository.findPlanByIdRepository(data.plan_id);
  if (!plan) {
    throw new Error("Membership plan not found");
  }

  // Use custom start date if provided, otherwise default to current date
  const baseDate = data.start_date ? new Date(data.start_date) : new Date();

  // Calculate membership expiration/payment due date
  const dueDate = new Date(baseDate);
  dueDate.setMonth(dueDate.getMonth() + plan.duration_months);

  // Run updates in a transaction so assigning plan and creating invoice is atomic
  return prisma.$transaction(async (tx) => {
    // 1. Update member with assigned plan, active status, and alignment of join_date with plan start date
    const updatedMember = await tx.member.update({
      where: { id: memberId },
      data: {
        plan_id: data.plan_id,
        status: "active",
        join_date: baseDate,
      },
      include: {
        gym: true,
        plan: true,
      },
    });

    // 2. Automatically generate the initial paid payment record matching plan price
    const initialAmountPaid = Number(plan.price);
    await tx.payment.create({
      data: {
        member_id: memberId,
        amount_paid: initialAmountPaid,
        amount_pending: 0.0,
        due_date: dueDate,
        payment_status: "paid",
        payment_date: baseDate,
        payment_type: "plan",
      },
    });

    return updatedMember;
  });
};
