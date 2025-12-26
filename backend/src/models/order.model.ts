import mongoose from "mongoose";
// import { CartItemSchema } from "./cart.model";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    default: "cash",
  },
  paymentStatus: {
    type: String,
    default: "pending",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", OrderSchema);