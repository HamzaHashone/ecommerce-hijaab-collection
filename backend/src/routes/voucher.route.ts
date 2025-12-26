import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { adminAuthentication } from "../middlewares/admin.middleware";
import {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  applyVoucher,
  removeVoucher,
} from "../controllers/voucher.controller";

const voucherRouter = Router();

voucherRouter.post(
  "/create",
  authenticateUser,
  adminAuthentication,
  createVoucher
);
voucherRouter.get(
  "/all",
  authenticateUser,
  adminAuthentication,
  getAllVouchers
);
voucherRouter.get(
  "/:id",
  authenticateUser,
  adminAuthentication,
  getVoucherById
);
voucherRouter.put("/:id", authenticateUser, adminAuthentication, updateVoucher);
voucherRouter.delete(
  "/:id",
  authenticateUser,
  adminAuthentication,
  deleteVoucher
);
voucherRouter.post("/apply", authenticateUser, applyVoucher);
voucherRouter.post("/remove", authenticateUser, removeVoucher);

export default voucherRouter;
