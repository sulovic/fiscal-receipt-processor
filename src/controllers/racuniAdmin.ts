import racuniModel from "../models/racun.js";
import type { Request, Response, NextFunction } from "express";
import { queryParamsSchema, fiscalReceiptSchema } from "../schemas/schemas.js";
import { Prisma } from "../generated/prisma/client.js";

const getAllRacuniController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = queryParamsSchema.parse(req?.query);

    const { sortBy, sortOrder, limit, page, search, filters } = queryParams;

    // default limit to 100 and page to 1 if not provided
    let limitNum = Number.parseInt(limit || "100", 10);
    if (Number.isNaN(limitNum) || limitNum <= 0) limitNum = 100;

    let pageNum = Number.parseInt(page || "1", 10);
    if (Number.isNaN(pageNum) || pageNum <= 0) pageNum = 1;

    const take = limitNum;
    const skip = (pageNum - 1) * limitNum;

    const orderBy = sortBy ? { [sortBy]: sortOrder || "desc" } : { ["id"]: sortOrder || "desc" };

    const andConditions: Prisma.FiscalReceiptWhereInput[] = [];
    const orConditions: Prisma.FiscalReceiptWhereInput[] = [];

    // allowed filter keys; the date is handled specially below so include it here
    const filterKeys = ["country", "receiptIssueDate"];
    const searchKeys = ["nameSurname", "shipmentNumber", "receiptNumber", "address", "phoneNumber", "externalLink", "receiptIssueDate"];

    if (filters) {
      for (const key in filters) {
        const value = filters[key];
        if (!filterKeys.includes(key)) {
          return res.status(400).json({ error: `Invalid filter key: ${key}` });
        }

        if (key === "receiptIssueDate") {
          const startOfDay = new Date(value as string);
          startOfDay.setHours(0, 0, 0, 0);

          const nextDay = new Date(startOfDay);
          nextDay.setDate(nextDay.getDate() + 1);

          const dateFilter = {
            receiptIssueDate: {
              gte: startOfDay,
              lt: nextDay,
            },
          };

          andConditions.push(dateFilter);
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

    const whereClause: Prisma.FiscalReceiptWhereInput = {
      AND: [...andConditions, orConditions.length > 0 ? { OR: orConditions } : {}],
    };

    const { receipts, count } = await racuniModel.getAllReceipts({
      whereClause,
      orderBy,
      take,
      skip,
    });

    return res.status(200).json({ data: receipts, count });
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
    const parsedReceipt = fiscalReceiptSchema.omit({ id: true, dateReceiptCollected: true, dateSent: true }).parse(req.body);

    const createdReceipt = await racuniModel.createReceipt(parsedReceipt);

    return res.status(201).json({ message: "Račun kreiran", data: createdReceipt });
  } catch (err) {
    next(err);
  }
};

const updateRacunController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const receiptNumber = req.params.brojRacuna as string;

    if (!receiptNumber) {
      return res.status(400).json({ error: "Nije poslat broj računa" });
    }

    const parsedReceipt = fiscalReceiptSchema.omit({ id: true, dateReceiptCollected: true, dateSent: true }).partial().parse(req.body);

    const updatedReceipt = await racuniModel.updateReceipt(receiptNumber, parsedReceipt);

    return res.status(200).json({ message: "Račun ažuriran", data: updatedReceipt });
  } catch (err) {
    next(err);
  }
};

const deleteRacunController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const receiptNumber = req.params.brojRacuna as string;

    if (!receiptNumber) {
      return res.status(400).json({ error: "Nije poslat broj računa" });
    }

    const deletedReceipt = await racuniModel.deleteReceipt(receiptNumber);

    return res.status(200).json({ message: "Račun obrisan", data: deletedReceipt });
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
