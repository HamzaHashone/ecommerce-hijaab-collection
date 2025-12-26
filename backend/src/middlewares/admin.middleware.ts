import { Request, Response, NextFunction } from "express";

export const adminAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const cookie = (req as any).cookies?.Ecommerce;

    // console.log(user.user.role, "user user user");

    if (!user || user.role !== "admin") {
      return res
        .status(401)
        .json({ message: "Unauthorized: only admin can use this.." });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error.." });
  }
};
