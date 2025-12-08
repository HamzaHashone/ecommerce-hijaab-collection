import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { adminAuthentication } from "../middlewares/admin.middleware";
import { DeleteUser, getAllUsers, GetUserById, UpdateUserStatus } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/all", authenticateUser, adminAuthentication, getAllUsers);
userRoutes.delete("/:id", authenticateUser, adminAuthentication, DeleteUser);
userRoutes.get("/:id", authenticateUser, adminAuthentication, GetUserById);
userRoutes.patch("/:id/status", authenticateUser, adminAuthentication, UpdateUserStatus);

export default userRoutes;
