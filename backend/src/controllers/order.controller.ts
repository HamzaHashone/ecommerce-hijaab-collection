import { Request, Response } from "express";
import { Product } from "../models/products.model";
// export const addToCart = async (req: Request, res: Response) => {
//   const { productId, quantity, color, size } = req?.body;
//   const user = (req as any)?.user;
//   if(!productId){
//     res.status(404).json({message:"product not recieved"})
//   }
//   const product = await Product.findById(productId);
//   // Get IP Address
//   const forwarded = req.headers["x-forwarded-for"];
//   const ip =
//     typeof forwarded === "string"
//       ? forwarded.split(",")[0]
//       : Array.isArray(forwarded)
//       ? forwarded[0]
//       : req.socket.remoteAddress;
//   // console.log("Backend: addToCart called");
//   // console.log("User:", user);
//   // console.log("Get IP:", ip);
//   // console.log("Products:", productId);
//   if (!product) {
//     res.status(404).json({ message: "Product Not Found" });
//   }
//   const availableQuantity =
//     product?.colors
//       ?.find((clr) => clr.color === color)
//       ?.sizes.find((s) => s.size === size)?.quantity || 0;
//   if (availableQuantity < quantity) {
//     res.status(404).json({
//       message: `Only ${availableQuantity} is available in ${size} size ${color} color of ${product?.title} `,
//     });
//   }
//   res.status(200).json({
//     success: true,
//     message: "Product added to cart successfully",
//     products: product,
//   });
// };

export const addToCart = async (req: Request, res: Response) => {
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

    product.colors[colorIndex].sizes[sizeIndex].quantity = (
      Number(product.colors[colorIndex].sizes[sizeIndex].quantity) -
      Number(quantity)
    ).toString();
    
    product.quantity = Number(product.quantity) - Number(quantity);

    await product.save();

    return res.status(200).json({
      message: "Product added to cart successfully",
      product: {
        id: product._id,
        title: product.title,
        quantity: Number(quantity),
        color,
        size,
        remainingStock: product.colors[colorIndex].sizes[sizeIndex].quantity,
      },
    });
  } catch (error) {
    console.error("Error in AddToCart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
