import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userDataSchema } from "../schemas/schemas.js";

interface RequestWithAuth extends Request {
  auth?: UserData;
}

const verifyAccessToken = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization Header" });
    }
    const [scheme, accessToken] = authHeader.split(" ");

    if (scheme !== "Bearer" || !accessToken) {
      return res.status(401).json({ error: "Invalid Authorization format" });
    }

    // Verify the accessToken signature

    const decodedAccessToken: JWTPayload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);

    //Attach authUser for future use

    const authUser = userDataSchema.parse(decodedAccessToken);

    req.auth = authUser;

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyAccessToken;
