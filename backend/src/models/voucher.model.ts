import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  discountType: {
    type: String,
    required: true,
    enum: ["percentage", "fixed"],
  },
  discount: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  participants: {
    type: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      uses: {
        type: Number,
        default: 0,
      },
    }],
    default: [],
  },
  maxUses: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

export const Voucher = mongoose.model("Voucher", VoucherSchema);