import { Request, Response } from "express";
import { Product } from "../models/products.model";
import { Cart } from "../models/cart.model";
import { Order } from "../models/order.model";
import { User } from "../models/User.model";
import { sendEmail } from "../services/emailService";

export const addToCart = async (req: Request, res: Response) => {
  const user = (req as any)?.user;
  try {
    const { productId, quantity, color, size } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const colorIndex = product.colors.findIndex((clr) => clr.color === color);
    if (colorIndex === -1) {
      return res.status(400).json({ message: `Color ${color} not available` });
    }

    const sizeIndex = product.colors[colorIndex].sizes.findIndex(
      (s) => s.size === size
    );
    if (sizeIndex === -1) {
      return res
        .status(400)
        .json({ message: `Size ${size} not available in ${color} color` });
    }

    const availableQuantity =
      product.colors[colorIndex].sizes[sizeIndex].quantity;

    if (Number(availableQuantity) < Number(quantity)) {
      return res.status(400).json({
        message: `Only ${availableQuantity} available in ${size} size ${color} color of ${product.title}`,
      });
    }

    // product.colors[colorIndex].sizes[sizeIndex].quantity = (
    //   Number(product.colors[colorIndex].sizes[sizeIndex].quantity) -
    //   Number(quantity)
    // ).toString();

    // product.quantity = Number(product.quantity) - Number(quantity);

    // await product.save();
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      const newCart = await Cart.create({ userId: user._id, items: [] });
      newCart.items.push({
        productId: product._id,
        quantity: Number(quantity),
        color,
        size,
        unitPrice: product.price,
        totalPrice: product.price * Number(quantity),
      });
      await newCart.save();
      return res
        .status(200)
        .json({ message: "Product added to cart successfully", cart: newCart });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );
    if (existingItem) {
      if (existingItem.color === color && existingItem.size === size) {
        existingItem.quantity =
          Number(existingItem.quantity) + Number(quantity);
        existingItem.totalPrice =
          existingItem.unitPrice * existingItem.quantity;
        await cart.save();
        return res
          .status(200)
          .json({ message: "Product quantity updated successfully", cart });
      }
    }

    cart.items.push({
      productId: product._id,
      quantity: Number(quantity),
      color,
      size,
      unitPrice: product.price,
      totalPrice: product.price * Number(quantity),
      product: product as any,
    });
    await cart.save();
    return res
      .status(200)
      .json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error in AddToCart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  const user = (req as any)?.user;
  try {
    const { productId, quantity, color, size } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.color === color &&
        item.size === size
    );
    if (existingItem) {
      if (
        quantity >
        existingItem.product?.colors
          ?.find((clr: any) => clr.color === color)
          ?.sizes?.find((s: any) => s.size === size)?.quantity
      ) {
        return res
          .status(400)
          .json({
            message: `Only ${
              existingItem.product?.colors
                ?.find((clr: any) => clr.color === color)
                ?.sizes?.find((s: any) => s.size === size)?.quantity
            } available in ${size} size ${color} color of ${
              existingItem.product.title
            }`,
          });
      }
      existingItem.quantity = Number(quantity);
      existingItem.totalPrice = existingItem.unitPrice * existingItem.quantity;
      await cart.save();

      return res
        .status(200)
        .json({ message: "Cart updated successfully", cart });
    } else {
      cart.items.push({
        productId: productId,
        quantity: Number(quantity),
        color: color,
        size: size,
        unitPrice: product.price,
        totalPrice: product.price * Number(quantity),
        product: product as any,
      });
      await cart.save();
    }
    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error in UpdateCart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const user = (req as any)?.user;
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res.status(200).json({ message: "Cart fetched successfully", cart });
  } catch (error) {
    console.error("Error in GetCart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const user = (req as any)?.user;
  try {
    const { productId, color, size } = req.body;
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.color === color &&
        item.size === size
    );
    if (!existingItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !== productId.toString() ||
        item.color !== color ||
        item.size !== size
    ) as any;
    await cart.save();
    return res
      .status(200)
      .json({ message: "Product removed from cart successfully", cart });
  } catch (error: any) {
    console.error("Error in RemoveFromCart:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const placeOrder = async (req: Request, res: Response) => {
  const user = (req as any)?.user;
  try {
    const { address, paymentMethod, personalDetails } = req.body;
    const addresses = (await User.findById(user._id).select(
      "addresses"
    )) as any;
    const addressData = addresses?.addresses?.filter(
      (add: any) => add._id.toString() === address.toString()
    );
    if (!addressData) {
      return res.status(404).json({ message: "Address not found" });
    }
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const order = await Order.create({
      userId: user._id,
      personalDetails: {
        firstName: personalDetails.firstName,
        lastName: personalDetails.lastName,
        email: personalDetails.email,
        phone: personalDetails.phone,
      },
      shippingAddress: address,
      items: cart.items,
      totalAmount: cart.totalPrice,
      voucherDiscount: cart.voucherDiscount,
      paymentMethod: paymentMethod,
      paymentStatus: "pending",
      status: "pending",
    });

    await cart.items.forEach(async (item: any) => {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const colorIndex = product.colors.findIndex(
        (clr: any) => clr.color === item.color
      );
      if (colorIndex === -1) {
        return res.status(404).json({ message: "Color not found" });
      }
      const sizeIndex = product.colors[colorIndex].sizes.findIndex(
        (s: any) => s.size === item.size
      );
      if (sizeIndex === -1) {
        return res.status(404).json({ message: "Size not found" });
      }
      product.colors[colorIndex].sizes[sizeIndex].quantity = (
        Number(product.colors[colorIndex].sizes[sizeIndex].quantity) -
        Number(item.quantity)
      ).toString();
      product.quantity = Number(product.quantity) - Number(item.quantity);
      await product.save();
    });

    await sendEmail({
      to: personalDetails.email,
      subject: "Order Confirmation",
      templateName: "orderConfirmation",
      templateData: {
        orderId: order._id.toString(),
        orderDate: order.createdAt,
        paymentMethod: order.paymentMethod,
        status: order.status,
        customerName: `${personalDetails.firstName} ${personalDetails.lastName}`,
        customerEmail: personalDetails.email,
        customerPhone: personalDetails.phone,
        shippingAddress: addressData[0],
        items: cart.items.map((item: any) => ({
          productTitle: item.product.title,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        })),
        totalAmount: cart.totalPrice,
        voucherDiscount: cart.voucherDiscount,
        trackingLink: `${process.env.NEXT_PUBLIC_APP_URL}/track-order?id=${order._id}`,
      },
    });

    await cart.deleteOne();
    await User.findByIdAndUpdate(user._id, {
      $inc: {
        totalOrders: 1,
        totalSpent: cart.totalPrice - cart.voucherDiscount,
      },
      lastOrder: new Date(),
    });
    return res
      .status(200)
      .json({ message: "Order created successfully", order });
  } catch (error: any) {
    console.error("Error in PlaceOrder:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate("userId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res
      .status(200)
      .json({ message: "Order fetched successfully", order: order as any });
  } catch (error: any) {
    console.error("Error in GetOrderById:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  const { search } = req.query;
  const { limit, skip } = req.query;
  try {
    const orders = await Order.find({
      $or: [
        { "personalDetails.firstName": { $regex: search, $options: "i" } },
        { "personalDetails.lastName": { $regex: search, $options: "i" } },
        { "personalDetails.email": { $regex: search, $options: "i" } },
        { "personalDetails.phone": { $regex: search, $options: "i" } },
        { "items.product.title": { $regex: search, $options: "i" } },
        { "items.product.description": { $regex: search, $options: "i" } },
      ],
    });
    const total = await Order.countDocuments({
      $and: [
        { "personalDetails.firstName": { $regex: search, $options: "i" } },
        { "personalDetails.lastName": { $regex: search, $options: "i" } },
        { "personalDetails.email": { $regex: search, $options: "i" } },
        { "personalDetails.phone": { $regex: search, $options: "i" } },
        { "items.product.title": { $regex: search, $options: "i" } },
        { "items.product.description": { $regex: search, $options: "i" } },
      ],
    });
    return res
      .status(200)
      .json({
        message: "Orders fetched successfully",
        orders: orders as any,
        total: total,
        limit: limit,
        skip: skip,
      });
  } catch (error: any) {
    console.error("Error in GetAllOrders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// const oldQuantity = existingItem.quantity;
//       const quantityDiff = Number(quantity) - oldQuantity;

//             const colorIndex = product.colors.findIndex(
//               (clr) => clr.color === color
//             );
//             if (colorIndex === -1) {
//               return res
//                 .status(400)
//                 .json({ message: `Color ${color} not available` });
//             }
//             const sizeIndex = product.colors[colorIndex].sizes.findIndex(
//               (s) => s.size === size
//             );
//             if (sizeIndex === -1) {
//               return res
//                 .status(400)
//                 .json({ message: `Size ${size} not available in ${color} color` });
//             }

//             // Adjust product inventory based on quantity difference
//             product.colors[colorIndex].sizes[sizeIndex].quantity = (
//               Number(product.colors[colorIndex].sizes[sizeIndex].quantity) -
//               quantityDiff
//             ).toString();

//             await product.save();
