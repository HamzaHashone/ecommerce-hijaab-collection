import { Router } from "express";
import { addToCart, getCart, removeFromCart, updateCart } from "../controllers/order.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const orderRouter = Router();

// orderRouter.post("/", addToCart);
// make the single route for addToCart and getCart using the same route /
orderRouter.post("/", authenticateUser, addToCart);
orderRouter.get("/", authenticateUser, getCart);
orderRouter.put("/", authenticateUser, updateCart);
orderRouter.delete("/", authenticateUser, removeFromCart);

export default orderRouter;
