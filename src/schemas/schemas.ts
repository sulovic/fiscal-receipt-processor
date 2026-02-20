import z from "zod";

export const envSchema = z.object({
  PORT: z.string().default("3499"),
  DATABASE_FICSALRECEIPTS_URL: z.string(),
  SECRET_KEY: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
});

export const fiscalReceiptSchema = z.object({
  id: z.number(),
  receiptNumber: z.string(),
  nameSurname: z.string(),
  address: z.string(),
  externalLink: z.string(),
  dateReceiptCollected: z.date().optional(),
  dateSent: z.date(),
});

export const userDataSchema = z.object({
  userId: z.number().int(),
  firstName: z.string().trim().min(3, "First name is required"),
  lastName: z.string().trim().min(3, "Last name is required"),
  email: z
    .string()
    .trim()
    .trim()
    .min(5, "Email is required")
    .max(254, "Email is too long")
    .regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Email contains invalid characters or format"),
  roleId: z.number().int(),
  roleName: z.string(),
});
