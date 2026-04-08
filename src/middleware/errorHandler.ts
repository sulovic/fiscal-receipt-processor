import type { Request, Response, ErrorRequestHandler, NextFunction } from "express";
import { ZodError } from "zod";

/**
 * Centralized error handler middleware.
 * - Handles JSON, CORS, Zod, Prisma, and custom errors.
 * - Returns structured error responses.
 * - Extendable with logging and monitoring hooks.
 */

const errorHandler: ErrorRequestHandler = (err: Error | any, req: Request, res: Response, _next: NextFunction): void => {
  // JSON parse errors
  if (err instanceof SyntaxError && (err as any).status === 400 && "body" in err) {
    res.status(400).json({ error: "Invalid JSON format" });
    return;
  }

  //CORS errors
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({ error: "CORS policy violation: Origin not allowed" });
    return;
  }

  //JWT errors
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  if (err.name === "TokenExpiredError") {
    res.status(401).json({ error: "Token expired" });
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation error",
      details: JSON.parse(err.message),
    });
    return;
  }

  // Google auth errors

  if (err.name === "Invalid Google token") {
    res.status(401).json({ error: "Invalid Google token" });
    return;
  }
  if (err.name === "Invalid Google token payload") {
    res.status(401).json({ error: "Invalid Google token payload" });
    return;
  }

  if (err.name === "Google auth Error") {
    res.status(401).json({ error: "Google auth Error" });
    return;
  }

  // Custom file upload errors (like invalid MIME or filename)
  if (err.message === "File type not allowed") {
    res.status(400).json({ error: "Invalid file type or extension" });
    return;
  }

  // Prisma errors
  if (err?.name?.includes("PrismaClientKnownRequestError")) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "Duplicate entry detected.", err });
      return;
    }
    if (err.code === "P2003") {
      res.status(400).json({ error: "Invalid foreign key reference.", err });
      return;
    }
    if (err.code === "P2009") {
      res.status(400).json({ error: "Data validation error. Please check your input data." });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ error: "Record not found." });
      return;
    }
    res.status(500).json({ error: "Prisma Client Known Request Error." });
    return;
  } else if (err?.name?.includes("PrismaClientInitializationError")) {
    if (err.code === "P1000") {
      res.status(503).json({ error: "Database is unavailable. Please check your database connection." });
      return;
    }
    if (err.code === "P1001") {
      res.status(503).json({ error: "Database connection timed out. Please try again later." });
      return;
    }
    if (err.code === "P1002") {
      res.status(503).json({ error: "Database connection was forcibly closed. Please check your server setup." });
      return;
    }
    res.status(500).json({ error: "Prisma Client Initialization Error." });
    return;
  } else if (err?.name?.includes("PrismaClientUnknownRequestError")) {
    res.status(400).json({ error: "Invalid request." });
    return;
  } else if (err?.name?.includes("PrismaClientValidationError")) {
    res.status(400).json({ error: "Data validation error. Please check your input data.", err });
    return;
  } else if (err?.name?.includes("PrismaClientRustPanicError")) {
    res.status(500).json({ error: "Prisma Client Rust Panic." });
    return;
  }

  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
};

export default errorHandler;
