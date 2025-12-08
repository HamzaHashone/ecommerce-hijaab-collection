import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  quantityForLowStock: {
    type: Number,
    required: true,
  },
  highValueUserSpents: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export const Settings = mongoose.model("Settings", SettingsSchema);
