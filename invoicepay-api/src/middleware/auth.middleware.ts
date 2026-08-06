import { validateToken, verifyToken } from "#utils/jwt.js";
import type { NextFunction, Request, Response } from "express";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = validateToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decode = verifyToken(token);
    req.user = {
      userId: decode.userId,
      email: decode.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
