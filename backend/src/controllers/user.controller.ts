import { Request, Response } from "express";
import { User } from "../models/User.model";
import { Settings } from "../models/settings.model";
import { sendEmail } from "../services/emailService";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { limit, skip, name, filter } = req.query;
    let query: any = {};
    if (name) {
      query.$or = [
        { firstName: { $regex: name, $options: "i" } },
        { lastName: { $regex: name, $options: "i" } },
        { email: { $regex: name, $options: "i" } },
      ];
    }
    if (filter === "active") {
      query.status = "active";
    }
    if (filter === "inactive") {
      query.status = "inactive";
    }
    const settings = await Settings.find().sort({ createdAt: -1 });
    if (filter === "high-value") {
      query.totalSpent = { $gt: settings[0]?.highValueUserSpents || 1000 };
    }
    if (filter === "new") {
      query.createdAt = {
        $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      };
    }
    query.role = { $ne: "admin" };
    console.log(query, "query to get users");
    const users = await User.find(query)
      .limit(Number(limit) || 10)
      .skip(Number(skip) || 0);

    const total = await User.find(query).countDocuments();
    if (!users) {
      return res.status(400).json({ message: "no user found" });
    }
    if (users) {
      return res
        .status(200)
        .json({ message: "successfully fetch users", users, total });
    }
  } catch (err) {
    console.log(err, "error in get all users");
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

export const DeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (err) {
    console.log(err, "error found in deleting user");
    res.status(500).json({ error: err, message: "Internal server error!" });
  }
};

export const GetUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.log(err, "error to get single user");
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const UpdateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    if (user?.status !== "active") {
      await sendEmail({
        to: user?.email,
        subject: "Account inactivate",
        templateName: "inactivateAccount",
        templateData: {},
      });
    }else{
      await sendEmail({
        to: user?.email,
        subject: "Account has been activated",
        templateName: "activateAccount",
        templateData: {},
      });
    }
    return res
      .status(200)
      .json({ message: "User status updated successfully!", user });
  } catch (err) {
    console.log(err, "error to update user status");
    return res.status(500).json({ message: "Internal server error!" });
  }
};
