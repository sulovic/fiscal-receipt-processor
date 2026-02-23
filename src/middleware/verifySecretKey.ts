import type { Request, Response, NextFunction } from "express";

const verifySecretKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization Header" });
    }
    const [scheme, secretKey] = authHeader.split(" ");

    if (scheme !== "Bearer" || !secretKey) {
      return res.status(401).json({ error: "Invalid Authorization format" });
    }

    // Verify the accessToken signature

    if (secretKey !== process.env.SECRET_KEY) {
      return res.status(401).json({ error: "Invalid Secret Key" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default verifySecretKey;
