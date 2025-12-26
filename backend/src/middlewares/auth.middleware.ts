import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_Ecommerce";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.Ecommerce;
    if (!token) return res.status(401).json({ message: "Unauthorized.." });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; user: any };

    const user = await User.findById(decoded.user._id);
    if (!user) return res.status(404).json({ message: "User not found.." });

    // Check status
    if (user.status !== "active"|| decoded.user.status !== "active") {
      // Remove cookie if status doesn't match
      res.clearCookie("Ecommerce");
      return res.status(401).json({ message: "Unauthorized.." });
    }
    (req as any).user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token.." });
  }
};
