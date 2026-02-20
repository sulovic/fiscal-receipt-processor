import { fiscalReceiptSchema } from "../schemas/schemas";

declare global {
  type Env = z.infer<typeof envSchema>;
  type FiscalReceipt = z.infer<typeof fiscalReceiptSchema>;
  type UserData = z.infer<typeof userDataSchema>;
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export {};
