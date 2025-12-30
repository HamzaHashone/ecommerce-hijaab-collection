import { Request, Response } from "express";
import { Settings } from "../models/settings.model";
import CompanyAddress from "../models/companyAddress";

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

export const updateCompanyAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, street1, city, state, zip, country, phone, email } = req.body;
    await CompanyAddress.findByIdAndUpdate(
      id,
      { name, street1, city, state, zip, country, phone, email },
      { new: true }
    );
    res.status(200).json({ message: "Company address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompanyAddress = async (req: Request, res: Response) => {
  try {
    const companyAddress = await CompanyAddress.findOne();
    if (!companyAddress) {
      return res.status(404).json({ message: "Company address not found" });
    }
    res.status(200).json({ companyAddress: companyAddress });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: (error as Error).message });
  }
};