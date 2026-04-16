import racunModel from "../models/racun.js";
import type { Request, Response, NextFunction } from "express";
import { fiscalReceiptSchema } from "../schemas/schemas.js";
import { Prisma } from "../generated/prisma/client.js";

const bulkUploadRacunController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    // validate that the body is a non-empty array of fiscal receipts
    const racuni: FiscalReceipt[] = req.body;

    if (racuni.length === 0) {
      return res.status(400).json({ error: "Nije poslat nijedan račun" });
    }

    const uploadResults: uploadFRResult[] = await Promise.all(
      racuni.map(async (racun) => {
        try {
          const parsedRacun = fiscalReceiptSchema.omit({ id: true, dateReceiptCollected: true, dateSent: true }).parse(racun);

          const created = await racunModel.createReceipt(parsedRacun);

          return {
            ...created,
            status: "success",
          };
        } catch (error: any) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return {
              ...racun,
              status: "duplicate",
            };
          }

          return {
            ...racun,
            status: "error",
            message: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    );

    return res.status(207).json({ data: uploadResults, count: uploadResults.length });
  } catch (err) {
    next(err);
  }
};

export default {
  bulkUploadRacunController,
};
