import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import { adminAuthentication } from "../middlewares/admin.middleware";

const settingsRoutes = Router();

settingsRoutes.get("/", authenticateUser, adminAuthentication, getSettings);
settingsRoutes.put(
  "/:id",
  authenticateUser,
  adminAuthentication,
  updateSettings
);

export default settingsRoutes;
