import { fiscalReceiptSchema, userDataSchema, envSchema, jwtPayloadSchema, uploadFRResultSchema } from "../schemas/schemas";

declare global {
  type Env = z.infer<typeof envSchema>;
  type FiscalReceipt = z.infer<typeof fiscalReceiptSchema>;
  type UserData = z.infer<typeof userDataSchema>;
  type JWTPayload = z.infer<typeof jwtPayloadSchema>;
  type uploadFRResult = z.infer<typeof uploadFRResultSchema>;
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export {};
