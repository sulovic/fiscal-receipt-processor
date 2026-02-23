import racunModel from "../models/racun.js";
import type { Request, Response, NextFunction } from "express";
import { fiscalReceiptSchema } from "../schemas/schemas.js";
import { Prisma } from "../../src/generated/prisma/client.ts";
import { z } from "zod";

const bulkUploadRacunController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const racuni = req.body;

    if (!racuni) {
      return res.status(400).json({ error: "Nije poslat nijedan račun" });
    }

    const bulkSchema = z.array(fiscalReceiptSchema);

    const parsedRacuni = bulkSchema.parse(racuni);

    if (parsedRacuni.length === 0) {
      return res.status(400).json({ error: "Nije poslat nijedan račun" });
    }

    const uploadResults: uploadFRResult[] = await Promise.all(
      parsedRacuni.map(async (racun) => {
        try {
          const created = await racunModel.createReceipt(racun);

          return {
            receiptNumber: created.receiptNumber,
            status: "success" as const,
          };
        } catch (error: any) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return {
              receiptNumber: racun.receiptNumber,
              status: "duplicate" as const,
            };
          }

          return {
            receiptNumber: racun.receiptNumber,
            status: "error" as const,
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
  bulkUploadRacunController,
};
