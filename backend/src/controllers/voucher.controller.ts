import { Request, Response } from "express";
import { Voucher } from "../models/voucher.model";
import { Cart } from "../models/cart.model";
import { Product } from "../models/products.model";

export const createVoucher = async (req: Request, res: Response) => {
  const { name, productId, discountType, discount, code, maxUses, expiresAt } =
    req.body;
  try {
    const voucher = await Voucher.create({
      name,
      productId,
      discountType,
      discount,
      code,
      maxUses,
      expiresAt,
    });
    res.status(201).json({ message: "Voucher created successfully", voucher });
  } catch (error) {
    console.error("Error in CreateVoucher:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllVouchers = async (req: Request, res: Response) => {
  const { limit = 10, skip = 0, code } = req.query;
  try {
    const vouchers = await Voucher.find()
      .skip(Number(skip))
      .limit(Number(limit));
    const total = await Voucher.countDocuments();
    res
      .status(200)
      .json({ message: "Vouchers fetched successfully", vouchers, total });
  } catch (error) {
    console.error("Error in GetAllVouchers:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getVoucherById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res.status(400).json({ message: "Voucher not found" });
    }
    res.status(200).json({ message: "Voucher fetched successfully", voucher });
  } catch (error) {
    console.error("Error in GetVoucherById:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateVoucher = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, productId, discountType, discount, code, maxUses, expiresAt } =
    req.body;
  try {
    const voucher = await Voucher.findByIdAndUpdate(
      id,
      { name, productId, discountType, discount, code, maxUses, expiresAt },
      { new: true }
    );
    res.status(200).json({ message: "Voucher updated successfully", voucher });
  } catch (error) {
    console.error("Error in UpdateVoucher:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteVoucher = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Voucher.findByIdAndDelete(id);
    res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (error) {
    console.error("Error in DeleteVoucher:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const applyVoucher = async (req: Request, res: Response) => {
  try {
    const user = (req as any)?.user;
    const { voucherCode } = req.body;
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    const voucher = await Voucher.findOne({ code: voucherCode });
    if (!voucher) {
      return res.status(400).json({ message: "Voucher not found" });
    }
    const isValid = cart.items.some(
      (item) => item.productId.toString() === voucher?.productId.toString()
    );
    if (!isValid) {
      return res
        .status(400)
        .json({ message: "Voucher not applicable to this product" });
    }
    const productForDiscount = await Product.findById(voucher.productId);
    if (!productForDiscount) {
      return res.status(400).json({ message: "Product not found" });
    }

    // check if the voucher has reached its maximum usage
    if (
      voucher.maxUses <=
      (voucher.participants.find(
        (participant) =>
          participant?.userId?.toString() === user?._id?.toString()
      )?.uses ?? 0)
    ) {
      return res
        .status(400)
        .json({ message: "Voucher has reached its maximum usage" });
    }

    if (voucher.discountType === "percentage") {
      const discount = (productForDiscount.price * voucher.discount) / 100;
      const totalPrice = cart.totalPrice - discount;
      await Cart.findByIdAndUpdate(
        cart._id,
        { voucherCode: voucher.code, voucherDiscount: discount },
        { new: true }
      );
      await Voucher.findByIdAndUpdate(
        voucher._id,
        {
          participants: [
            ...voucher.participants,
            { userId: user._id, uses: 1 },
          ],
        },
        { new: true }
      );
      return res.status(200).json({
        message: "Voucher applied successfully",
        discount,
        totalPrice,
      });
    } else if (voucher.discountType === "fixed") {
      const discount = voucher.discount;
      const totalPrice = cart.totalPrice - discount;
      await Cart.findByIdAndUpdate(
        cart._id,
        { voucherCode: voucher.code, voucherDiscount: discount },
        { new: true }
      );
      await Voucher.findByIdAndUpdate(
        voucher._id,
        {
          participants: [
            ...voucher.participants,
            {
              userId: user._id,
              uses:
                voucher.participants.find(
                  (participant) =>
                    participant?.userId?.toString() === user?._id?.toString()
                )?.uses ?? 0 + 1,
            },
          ],
        },
        { new: true }
      );
      return res.status(200).json({
        message: "Voucher applied successfully",
        discount,
        totalPrice,
      });
    } else {
      return res.status(400).json({ message: "Invalid discount type" });
    }
  } catch (error) {
    console.error("Error in ApplyVoucher:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const removeVoucher = async (req: Request, res: Response) => {
  try {
    const user = (req as any)?.user;
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    const voucher = await Voucher.findOne({ code: cart.voucherCode });
    if (!voucher) {
      return res.status(400).json({ message: "Voucher not found" });
    }
    const isValid = cart.items.some(
      (item) => item.productId.toString() === voucher?.productId.toString()
    );
    if (!isValid) {
      return res
        .status(400)
        .json({ message: "Voucher not applicable on any product in the cart" });
    }
    await Cart.findByIdAndUpdate(
      cart._id,
      { voucherCode: null, voucherDiscount: 0 },
      { new: true }
    );
    await Voucher.findByIdAndUpdate(
      voucher._id,
      {
        participants: voucher.participants.map((participant) =>
          participant?.userId?.toString() === user?._id?.toString()
            ? { ...participant, uses: (participant?.uses ?? 0) - 1 }
            : (participant as any)
        ),
      } as any,
      { new: true }
    );
    return res.status(200).json({ message: "Voucher removed successfully" });
  } catch (error) {
    console.error("Error in RemoveVoucher:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
