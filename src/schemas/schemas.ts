import z from "zod";

export const envSchema = z.object({
  PORT: z.string().default("3499"),
  DATABASE_FISCALRECEIPTS_URL: z.string(),
  SECRET_KEY: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  GOOGLE_SCRIPT_URL: z.string(),
  GOOGLE_SCRIPT_TOKEN: z.string(),
});

export const queryParamsSchema = z.object({
  sortBy: z.string().nullable().optional(),
  sortOrder: z.enum(["asc", "desc"]).nullable().optional(),
  limit: z.string().nullable().optional(),
  page: z.string().nullable().optional(),
  search: z.string().nullable().optional(),
  filters: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .nullable()
    .optional(),
});

export const fiscalReceiptSchema = z.object({
  id: z.number(),
  receiptNumber: z.string(),
  shipmentNumber: z.string(),
  receiptIssueDate: z.coerce.date(),
  country: z.enum(["SRBIJA", "CRNA_GORA"]),
  nameSurname: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  externalLink: z.string(),
  dateReceiptCollected: z.coerce.date().optional(),
  dateSent: z.coerce.date().optional(),
});

export const uploadFRResultSchema = fiscalReceiptSchema.extend({
  status: z.enum(["success", "duplicate", "error"]),
  message: z.string().optional(),
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

export const jwtPayloadSchema = userDataSchema.extend({
  iat: z.number(),
  exp: z.number(),
});
