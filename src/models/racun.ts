import { PrismaClient, Prisma } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_FISCALRECEIPTS_URL;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

const getAllReceipts = async ({ whereClause, orderBy, take, skip }: { whereClause?: Prisma.FiscalReceiptWhereInput; orderBy?: Prisma.FiscalReceiptOrderByWithRelationInput; take?: number; skip?: number }) => {
  const [receipts, count] = await prisma.$transaction([
    prisma.fiscalReceipt.findMany({
      where: { ...whereClause },
      orderBy,
      take,
      skip,
    }),
    prisma.fiscalReceipt.count({
      where: { ...whereClause },
    }),
  ]);

  return { receipts, count };
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
  getReceipt,
  createReceipt,
  updateReceipt,
  deleteReceipt,
};
