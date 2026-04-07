import racunModel from "../models/racun.js";
import type { Request, Response, NextFunction } from "express";
import { fiscalReceiptSchema } from "../schemas/schemas.js";
import { Prisma } from "../generated/prisma/client.js";

const bulkPullRacunController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const googleSheetsUrl = process.env.GOOGLE_SHEETS_URL;
    const googleSheetsToken = process.env.GOOGLE_SHEETS_TOKEN;

    if (!googleSheetsUrl || !googleSheetsToken) {
      return res.status(500).json({ error: "Missing Google Sheets credentials" });
    }

    const googleSheetsFullPath = `${googleSheetsUrl}?token=${googleSheetsToken}`;

    const racuni: FiscalReceipt[] = await fetch(googleSheetsFullPath).then((response) => response.json());

    const uploadResults: uploadFRResult[] = await Promise.all(
      racuni.map(async (racun) => {
        try {
          const parsedRacun = fiscalReceiptSchema.omit({ id: true, dateReceiptCollected: true, dateSent: true }).parse(racun);

          const created = await racunModel.createReceipt(parsedRacun);

          return {
            receiptNumber: created.receiptNumber,
            status: "success",
          };
        } catch (error: any) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return {
              receiptNumber: racun.receiptNumber,
              status: "duplicate",
            };
          }

          return {
            receiptNumber: racun.receiptNumber,
            status: "error",
            message: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    );

    return res.status(207).json(uploadResults);
  } catch (err) {
    next(err);
  }
};

export default {
  bulkPullRacunController,
};
