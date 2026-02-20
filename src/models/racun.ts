import { PrismaClient, Prisma } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_FISCALRECEIPTS_URL;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

const getAllReceipts = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.FiscalReceiptWhereInput; orderBy?: Prisma.FiscalReceiptOrderByWithRelationInput; take?: number; skip?: number }) => {
  return await prisma.fiscalReceipt.findMany({
    where: { ...whereClause },
    orderBy: orderBy,
    take: take,
    skip: skip,
  });
};

const getAllReceiptsCount = async ({ whereClause }: { whereClause?: Prisma.FiscalReceiptWhereInput }) => {
  return await prisma.fiscalReceipt.count({
    where: { ...whereClause },
  });
};

const getReceipt = async (receiptNumber: string) => {
  return await prisma.fiscalReceipt.findFirst({
    where: {
      receiptNumber,
    },
  });
};

const createReceipt = async (receipt: Prisma.FiscalReceiptCreateInput) => {
  return await prisma.fiscalReceipt.create({
    data: receipt,
  });
};

const updateReceipt = async (receiptNumber: string, receipt: Prisma.FiscalReceiptUpdateInput) => {
  return await prisma.fiscalReceipt.update({
    where: {
      receiptNumber,
    },
    data: receipt,
  });
};

const deleteReceipt = async (receiptNumber: string) => {
  return await prisma.fiscalReceipt.delete({
    where: {
      receiptNumber,
    },
  });
};

export default {
  getAllReceipts,
  getAllReceiptsCount,
  getReceipt,
  createReceipt,
  updateReceipt,
  deleteReceipt,
};
