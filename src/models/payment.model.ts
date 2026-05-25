import { Payment as PrismaPayment } from "../generated/prisma";

export type Payment = PrismaPayment;

export interface RecordPaymentDTO {
  amount_paid: number;
}

export interface RenewMembershipDTO {
  plan_id: number;
  payment_date?: string | Date;
}
