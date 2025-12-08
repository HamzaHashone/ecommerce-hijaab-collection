import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    featured: {
      type: Boolean,
      required: true,
    },
    colors: [
      {
        color: { type: String, required: true },
        sizes: [
          {
            size: { type: String, required: true },
            quantity: { type: String, required: true }
          }
        ]
      }
    ],
    // colors: {
    //   type: [String],
    //   required: true,
    // },
    // sizes: {
    //   type: [String],
    //   required: true,
    // },
    material: {
      type: String,
      // required: true,
    },
    live: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
