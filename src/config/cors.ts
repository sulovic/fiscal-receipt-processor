import type { CorsOptions } from "cors";

const whitelist = ["https://apps.shoppy.rs", "https://appstest.shoppy.rs", "https://127.0.0.1:3000", "https://localhost:3000"];

const corsConfig: CorsOptions = {
  origin: (requestOrigin, callback) => {
    if (!requestOrigin || whitelist.includes(requestOrigin)) {
      callback(null, true);
    } else {
      console.warn("Blocked CORS request from:", requestOrigin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsConfig;
