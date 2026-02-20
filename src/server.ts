import "dotenv/config";
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envSchema } from "./schemas/schemas.js";

import corsConfig from "./config/cors.js";
import rateLimiter from "./middleware/rateLimiter.js";
import verifyAccessToken from "./middleware/verifyAccessToken.js";
import checkUserRole from "./middleware/checkUserRole.js";

// Routers

envSchema.parse(process.env);

const app = express();
const PORT = process.env.PORT || 3499;

// Nginx reverse proxy
app.set("trust proxy", 1);

app.use(cors(corsConfig));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.set("query parser", "extended");
app.use(cookieParser());

// Global rate limiter
app.use(rateLimiter(1, 100));

app.post("/collect-receipts", async (req, res) => {
  const { fiscal_receipt_number, name, surname, customer_address, fiscal_receipt_external_link, date_receipt_sent_to_customer } = req.body;

  if (!fiscal_receipt_number || !name || !surname || !customer_address || !fiscal_receipt_external_link || !date_receipt_sent_to_customer) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const receipt = await prisma.fiscalReceipt.create({
      data: {
        receiptNumber: fiscal_receipt_number,
        name,
        surname,
        address: customer_address,
        externalLink: fiscal_receipt_external_link,
        dateSent: new Date(date_receipt_sent_to_customer),
      },
    });
    res.status(201).json(receipt);
  } catch (error) {
    if (error.code === "P2002") {
      res.status(409).json({ error: "Receipt number already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.get("/receipts", async (req, res) => {
  const { receipt_number } = req.query;

  if (!receipt_number) {
    return res.status(400).json({ error: "receipt_number query parameter is required" });
  }

  try {
    const receipt = await prisma.fiscalReceipt.findUnique({
      where: { receiptNumber: receipt_number },
    });

    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    res.redirect(receipt.externalLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
