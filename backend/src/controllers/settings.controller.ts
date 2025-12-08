import { Request, Response } from "express";
import { Settings } from "../models/settings.model";

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Settings.find();
    res.status(200).json({ settings });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createSettings = async (req: Request, res: Response) => {
  try {
    const { quantityForLowStock, highValueUserSpents } = req.body;
    const settings = await Settings.create({ quantityForLowStock, highValueUserSpents });
    res.status(201).json({ settings });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { quantityForLowStock, highValueUserSpents } = req.body;
    const settings = await Settings.findByIdAndUpdate(
      req.params.id,
      { quantityForLowStock, highValueUserSpents },
      { new: true }
    );
    res.status(200).json({ settings });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
