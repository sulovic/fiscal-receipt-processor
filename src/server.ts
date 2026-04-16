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
import errorHandler from "./middleware/errorHandler.js";

// Routers

import racunRouter from "./routers/racun.js";
import bulkUploadRacunRouter from "./routers/bulkUploadRacun.js";
import bulkPullRacunRouter from "./routers/bulkPullRacun.js";
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
app.use("/api/v1/racuni/bulk-pull", verifyAccessToken, bulkPullRacunRouter);
app.use("/api/v1/racuni/bulk-upload", verifySecretKey, bulkUploadRacunRouter);
app.use("/api/v1/racuni/racuni-admin", verifyAccessToken, checkUserRole, racuniAdminRouter);

app.use("/", racunRouter);

//global error handler
app.use(errorHandler);

// handle unhandled promise rejections globally
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
