import { Request, Response } from "express";
import { Product } from "../models/products.model";
import { Cart } from "../models/cart.model";
import { Order } from "../models/order.model";

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
      console.log(quantity, "quantity", existingItem.product?.colors?.find((clr: any) => clr.color === color)?.sizes?.find((s: any) => s.size === size)?.quantity, "existingItem.product.quantity");
      if(quantity > existingItem.product?.colors?.find((clr: any) => clr.color === color)?.sizes?.find((s: any) => s.size === size)?.quantity) {
        return res.status(400).json({ message: `Only ${existingItem.product?.colors?.find((clr: any) => clr.color === color)?.sizes?.find((s: any) => s.size === size)?.quantity} available in ${size} size ${color} color of ${existingItem.product.title}` });
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
    console.log(user, "user");
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

export const checkout = async (req: Request, res: Response) => {
  const user = (req as any)?.user;
  try {
    // const { cartId } = req.body;
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const order = await Order.create({
      userId: user._id,
      cartId: cart._id,
      status: "pending",
      paymentMethod: "cash",
      paymentStatus: "pending",
    });
    return res.status(200).json({ message: "Order created successfully", order });
  } catch (error: any) {
    console.error("Error in Checkout:", error);
    return res.status(500).json({ message: error.message });
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
