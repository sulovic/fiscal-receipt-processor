import racunModel from "../models/racun.js";
import type { Request, Response, NextFunction } from "express";
import { fiscalReceiptSchema } from "../schemas/schemas.js";
import { Prisma } from "../generated/prisma/client.js";

const bulkPullRacunController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const googleScriptToken = process.env.GOOGLE_SCRIPT_TOKEN;

    if (!googleScriptUrl || !googleScriptToken) {
      return res.status(500).json({ error: "Missing Google Script URL or credentials" });
    }

    const googleSheetsFullPath = `${googleScriptUrl}?token=${googleScriptToken}`;

    const racuni: FiscalReceipt[] = await fetch(googleSheetsFullPath).then((response) => response.json());

    const uploadResults: uploadFRResult[] = await Promise.all(
      racuni.map(async (racun) => {
        try {
          const parsedRacun = fiscalReceiptSchema.omit({ id: true, dateReceiptCollected: true, dateSent: true }).parse(racun);

          const created = await racunModel.createReceipt(parsedRacun);

          return {
            receiptNumber: created.receiptNumber,
            shipmentNumber: created.shipmentNumber,
            nameSurname: created.nameSurname,
            country: created.country,
            status: "success",
          };
        } catch (error: any) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return {
              receiptNumber: racun.receiptNumber,
              shipmentNumber: racun.shipmentNumber,
              nameSurname: racun.nameSurname,
              country: racun.country,
              status: "duplicate",
            };
          }

          return {
            receiptNumber: racun.receiptNumber,
            shipmentNumber: racun.shipmentNumber,
            nameSurname: racun.nameSurname,
            country: racun.country,
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
