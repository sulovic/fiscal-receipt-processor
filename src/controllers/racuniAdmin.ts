import racuniModel from "../models/racun.js";
import type { Request, Response, NextFunction } from "express";
import { queryParamsSchema, fiscalReceiptSchema } from "../schemas/schemas.js";
import { Prisma } from "../../src/generated/prisma/client.js";

const getAllRacuniController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { sortBy, sortOrder, limit, page, search, filters } = queryParams;

    // default limit to 100 and page to 1 if not provided
    const limitNum = parseInt(limit || "100", 10);
    const pageNum = parseInt(page || "1", 10);

    const take = limitNum;
    const skip = (pageNum - 1) * limitNum;

    const orderBy = sortBy ? { [sortBy]: sortOrder || "desc" } : { ["idReklamacije"]: sortOrder || "desc" };

    const andConditions: Prisma.ReklamacijeWhereInput[] = [];
    const orConditions: Prisma.ReklamacijeWhereInput[] = [];

    const filterKeys = ["zemljaReklamacije", "statusReklamacije", "odgovornaOsoba", "godina"];
    const searchKeys = ["brojReklamacije", "imePrezime", "email", "telefon", "adresa", "brojRacuna", "nazivProizvoda"];

    if (filters) {
      for (const key in filters) {
        const value = filters[key];
        if (!filterKeys.includes(key)) {
          return res.status(400).json({ error: `Invalid filter key: ${key}` });
        }

        if (key === "godina") {
          const years = (Array.isArray(value) ? value : [value]).map((y: string) => Number(y));

          // Convert years to date ranges
          const yearFilters = years.map((y: number) => ({
            datumPrijema: {
              gte: new Date(y, 0, 1), // Jan 1, year y
              lte: new Date(y, 11, 31), // Dec 31, year y
            },
          }));

          // Combine with OR (any of the years)
          andConditions.push({ OR: yearFilters });
        } else {
          andConditions.push({ [key]: { in: Array.isArray(value) ? value : [value] } });
        }
      }
    }

    if (search) {
      orConditions.push(
        ...searchKeys.map((key) => ({
          [key]: {
            contains: search,
            mode: "insensitive",
          },
        })),
      );
    }

    const whereClause: Prisma.ReklamacijeWhereInput = {
      AND: [...andConditions, orConditions.length > 0 ? { OR: orConditions } : {}],
    };

    const reklamacijeData = await reklamacijeModel.getAllReklamacije({
      whereClause,
      orderBy,
      take,
      skip,
    });

    return res.status(200).json({ data: reklamacijeData });
  } catch (err) {
    next(err);
  }
};

const getAllRacuniCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { search, filters } = queryParams;

    const andConditions: Prisma.ReklamacijeWhereInput[] = [];
    const orConditions: Prisma.ReklamacijeWhereInput[] = [];

    const filterKeys = ["zemljaReklamacije", "statusReklamacije", "odgovornaOsoba", "godina"];
    const searchKeys = ["brojReklamacije", "imePrezime", "email", "telefon", "adresa", "brojRacuna", "nazivProizvoda"];

    if (filters) {
      for (const key in filters) {
        const value = filters[key];
        if (!filterKeys.includes(key)) {
          return res.status(400).json({ error: `Invalid filter key: ${key}` });
        }

        if (key === "godina") {
          const years = (Array.isArray(value) ? value : [value]).map((y: string) => Number(y));

          // Convert years to date ranges
          const yearFilters = years.map((y: number) => ({
            datumPrijema: {
              gte: new Date(y, 0, 1), // Jan 1, year y
              lte: new Date(y, 11, 31), // Dec 31, year y
            },
          }));

          // Combine with OR (any of the years)
          andConditions.push({ OR: yearFilters });
        } else {
          andConditions.push({ [key]: { in: Array.isArray(value) ? value : [value] } });
        }
      }
    }

    if (search) {
      orConditions.push(
        ...searchKeys.map((key) => ({
          [key]: {
            contains: search,
            mode: "insensitive",
          },
        })),
      );
    }

    const whereClause = {
      AND: [...andConditions, orConditions.length > 0 ? { OR: orConditions } : {}],
    };

    const reklamacijeCount = await reklamacijeModel.getAllReklamacijeCount({ whereClause });
    return res.status(200).json({ count: reklamacijeCount });
  } catch (err) {
    next(err);
  }
};

const getRacunController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const receiptNumber = req.params.brojRacuna as string;

    if (!receiptNumber) {
      return res.status(400).json({ error: "Nije poslat broj računa" });
    }

    const receiptData = await racuniModel.getReceipt(receiptNumber);

    if (!receiptData) {
      return res.status(404).json({ error: "Račun nije pronađen" });
    }

    return res.status(200).json({ data: receiptData });
  } catch (err) {
    next(err);
  }
};

const createRacunController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const parsedReceipt = fiscalReceiptSchema.omit({ id: true }).parse(req.body);

    const createdReceipt = await racuniModel.createReceipt(parsedReceipt);

    return res.status(201).json({ message: "Račun kreiran", data: createdReceipt });
  } catch (err) {
    next(err);
  }
};

const updateRacunController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const idReklamacije: number = parseInt(req.params.idReklamacije);

    if (isNaN(idReklamacije)) {
      return res.status(400).json({ error: "Invalid reklamacija ID" });
    }

    const parsedReklamacija = reklamacijaSchema.omit({ idReklamacije: true }).parse(req.body);

    // convert files null to Prisma.JsonNull
    const prismaParsedReklamacija: Prisma.ReklamacijeUpdateInput = { ...parsedReklamacija, files: parsedReklamacija.files ?? Prisma.JsonNull };

    const updatedReklamacija = await reklamacijeModel.updateReklamacija(idReklamacije, prismaParsedReklamacija);

    return res.status(200).json({ message: "Reklamacija updated", data: updatedReklamacija });
  } catch (err) {
    next(err);
  }
};

const deleteRacunController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const idReklamacije: number = parseInt(req.params.idReklamacije);

    if (isNaN(idReklamacije)) {
      return res.status(400).json({ error: "Invalid JCI ID" });
    }

    const deletedReklamacija = await reklamacijeModel.deleteReklamacija(idReklamacije);

    return res.status(200).json({ message: "Reklamacija deleted", data: deletedReklamacija });
  } catch (err) {
    next(err);
  }
};

export default {
  getAllRacuniController,
  getRacunController,
  createRacunController,
  updateRacunController,
  deleteRacunController,
};
