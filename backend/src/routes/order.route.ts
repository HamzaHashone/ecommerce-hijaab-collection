import { Router } from "express";
import { addToCart } from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.post("/", addToCart);

export default orderRouter;
