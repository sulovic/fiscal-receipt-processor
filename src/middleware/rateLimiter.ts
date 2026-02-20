import rateLimit from "express-rate-limit";

const rateLimiter = (timeMinutes = 3, maxNo = 10) =>
  rateLimit({
    windowMs: timeMinutes * 60 * 1000,
    max: maxNo,
    message: "Too many login attempts, please try again later",
  });

export default rateLimiter;
