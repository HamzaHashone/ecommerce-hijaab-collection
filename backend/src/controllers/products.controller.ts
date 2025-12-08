import { Request, Response } from "express";
import { Product } from "../models/products.model";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { Settings } from "../models/settings.model";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "detgh1kpt",
  api_key: process.env.CLOUDINARY_API_KEY || "588655336827796",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "r65v7uqxsmv65GVliWSPtWQ6A1k",
});

interface MulterFile {
  path: string;
  originalname: string;
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      title,
      quantity,
      description,
      price,
      colors,
      sizes,
      live,
      featured,
      material,
    } = req.body;

    const files = req.files as MulterFile[];
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one product image is required" });
    }
    if (!title)
      return res.status(400).json({ message: "Product title is required" });
    if (!description)
      return res
        .status(400)
        .json({ message: "Product description is required" });
    if (!price)
      return res.status(400).json({ message: "Product price is required" });
    if (!colors)
      return res.status(400).json({ message: "Product colors are required" });
    if (!quantity)
      return res.status(400).json({ message: "Product quantity is required" });

    // parse arrays
    const colorsArray = JSON.parse(colors as any);
    // const sizesArray = JSON.parse(sizes as string);

    // upload images to cloudinary
    const uploadResults = await Promise.all(
      files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "products" })
      )
    );

    // remove local files
    files.forEach((file) => fs.unlinkSync(file.path));

    // create product
    const product = await Product.create({
      title,
      description,
      quantity,
      price,
      material,
      featured,
      live,
      colors: colorsArray,
      // sizes: sizesArray,
      images: uploadResults.map((r) => r.secure_url),
    });

    res.status(200).json({ message: "Product Created Successfully", product });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: (error as Error).message,
    });
  }
};

// export const getAllProducts = async (req: Request, res: Response) => {
//   try {
//     const { limit, skip, title, sort, filter } = req?.params;

//     let query = { title: "", featured: false, material: "" };
//     if (title) {
//       query.title = { $regex: title, $option: "i" } as any;
//     }
//     if (filter === "allProducts") {
//       query.featured = false;
//       query.material = "";
//     }
//     if (filter === "Cotton" || filter === "Chiffon" || filter === "Silk") {
//       query.material = { $regex: filter, $option: "i" } as any;
//     }
//     if (filter === "featured") {
//       query.featured = true;
//     }
//     let sortOption = { createdAt: -1 } as any;
//     switch (sort) {
//       case "name-asc":
//         sortOption = { title: 1 } as any;
//         break;
//       case "name-dsc":
//         sortOption = { title: -1 } as any;
//         break;
//       case "price-low-to-high":
//         sortOption = { price: 1 } as any;
//         break;
//       case "price-high-to-low":
//         sortOption = { price: -1 } as any;
//         break;
//     }
//     const products = await Product.find(query)
//       .sort(sortOption)
//       .limit(Number(limit))
//       .skip(Number(skip));

//     const total = await Product.countDocuments(query);
//     if (products) {
//       return res
//         .status(200)
//         .json({ message: "Fetch Products Successfully", products, total });
//     }
//     if (!products) {
//       return res.status(400).json({ message: "Products Not Found" });
//     }
//   } catch (err: any) {
//     console.log(err, "error in get all products");
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { limit, skip, title, sort, filter } = req.query; // Correct way

    let query: any = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (filter === "featured") {
      query.featured = true;
    }
    const settings = await Settings.find().sort({ createdAt: -1 });
    if (filter === "low-stock") {
      query.quantity = { $lt: settings[0]?.quantityForLowStock || 10 };
    } else if (
      [
        "Cotton-Jersey",
        "Chiffon",
        "Premium-Silk",
        "Georgette",
        "Bamboo-Fiber",
      ].includes(filter as string)
    ) {
      query.material = { $regex: filter, $options: "i" };
    }

    let sortOption: any = { createdAt: -1 };
    switch (sort) {
      case "name-asc":
        sortOption = { title: 1 };
        break;
      case "name-dsc":
        sortOption = { title: -1 };
        break;
      case "price-low-to-high":
        sortOption = { price: 1 };
        break;
      case "price-high-to-low":
        sortOption = { price: -1 };
        break;
      case "latest":
        sortOption = { createdAt: -1 };
        break;
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .limit(Number(limit)) // Convert to number
      .skip(Number(skip)); // Convert to number

    const total = await Product.countDocuments(query);

    return res.status(200).json({
      message: "Fetch Products Successfully",
      products,
      total,
    });
  } catch (err) {
    console.error(err, "error in get all products");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const DeleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(400).json({ message: `product not found` });
    }
    if (product) {
      return res
        .status(200)
        .json({ message: `${product.title} has been remove from products` });
    }
  } catch (err: any) {
    console.log(err, "error in deleting product");
    res.status(500).json({ message: "internal server error", error: err });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ message: `product not found` });
    }
    return res.status(200).json({ message: "product found", product });
  } catch (err: any) {
    console.log(err, "error in getting product by id");
    res.status(500).json({ message: "internal server error", error: err });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "req req req 2");
    const { id } = req.params;
    const productToUpdate = await Product.findById(id);
    const files = req.files as MulterFile[];
    const {
      title,
      description,
      quantity,
      price,
      material,
      featured,
      live,
      colors,
      // sizes,
      oldImages,
    } = req.body;
    let UpdatedImages: string[] = [];
    if (oldImages && oldImages.length > 0) {
      if (!productToUpdate) {
        return res.status(400).json({ message: `product not found` });
      }
      UpdatedImages = productToUpdate.images.filter((image) =>
        oldImages.includes(image)
      );
    }
    if (files && files.length > 0) {
      const uploadResults = await Promise.all(
        files.map((file) =>
          cloudinary.uploader.upload(file.path, { folder: "products" })
        )
      );
      UpdatedImages = [
        ...UpdatedImages,
        ...uploadResults.map((r) => r.secure_url),
      ];
      files.forEach((file) => fs.unlinkSync(file.path));
    }
    const colorsArray = JSON.parse(colors as any);

    const product = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        quantity,
        price,
        material,
        featured,
        live,
        colors: colorsArray,
        // sizes,
        images: UpdatedImages,
      },
      { new: true }
    );
    if (!productToUpdate) {
      return res.status(400).json({ message: `product not found` });
    }
    return res
      .status(200)
      .json({ message: "product updated", productToUpdate });
  } catch (err: any) {
    console.log(err, "error in updating product");
    res.status(500).json({ message: "internal server error", error: err });
  }
};
