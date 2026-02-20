import racunModel from "../models/racun.js";
import type { Request, Response, NextFunction } from "express";
import { fiscalReceiptSchema } from "../schemas/schemas.js";
import { Prisma } from "../generated/prisma/client.js";

const getRacunController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const brojRacuna = req.params.brojRacuna as string;

    if (!brojRacuna) {
      return res.status(400).json({ error: "Nije unet broj računa" });
    }

    const racunData = await racunModel.getReceipt(brojRacuna);

    if (!racunData) {
      return res.status(404).json({ error: "Račun ne postoji" });
    } else {
      return res.status(200).json({ data: racunData });
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getRacunController,
};
