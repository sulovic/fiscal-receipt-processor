import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envSchema } from "./schemas/schemas.js";
import corsConfig from "./config/cors.js";
import rateLimiter from "./middleware/rateLimiter.js";
import verifyAccessToken from "./middleware/verifyAccessToken.js";
import checkUserRole from "./middleware/checkUserRole.js";
import verifySecretKey from "./middleware/verifySecretKey.js";

// Routers

import racunRouter from "./routers/racun.js";
import bulkUploadRacunRouter from "./routers/bulkUploadRacun.js";
import racuniAdminRouter from "./routers/racuniAdmin.js";

envSchema.parse(process.env);

const app = express();
// coerce port to number since env vars are strings
const PORT = Number(process.env.PORT) || 3499;

// Nginx reverse proxy
app.set("trust proxy", 1);

app.use(cors(corsConfig));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.set("query parser", "extended");
app.use(cookieParser());

// Global rate limiter
app.use(rateLimiter(1, 100));

app.use("/obrada-racuna", verifySecretKey, bulkUploadRacunRouter);
app.use("/racuni-admin", verifyAccessToken, checkUserRole, racuniAdminRouter);

app.use("/", racunRouter);

// Global error handler must come after all other middleware and routes
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error", err);
  if (res.headersSent) {
    // delegate to default handler if headers already sent
    return next(err);
  }
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// handle unhandled promise rejections globally
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
