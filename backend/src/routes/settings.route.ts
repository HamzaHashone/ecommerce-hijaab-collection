import { Router } from "express";
import {
  getSettings,
  updateSettings,
  updateCompanyAddress,
  getCompanyAddress,
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
settingsRoutes.put("/company-address/:id", authenticateUser, adminAuthentication, updateCompanyAddress);
settingsRoutes.get("/company-address", getCompanyAddress);
export default settingsRoutes;
