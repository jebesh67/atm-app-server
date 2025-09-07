import { Request, Response } from "express";
import { getUserFromJwtToken } from "../utils/jwt";
import User, { PublicUser } from "../models/user.model";
import Transactions from "../models/transaction.model";

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const user: PublicUser | null = await getUserFromJwtToken(token);
    if (!user)
      return res.status(401).json({ message: "Invalid or expired token" });

    const userDoc = await User.findById(user._id);
    if (!userDoc) return res.status(404).json({ message: "User not found" });

    const transactions = await Transactions.find({
      accountNumber: userDoc.accountNumber,
    }).sort({ date: -1 });

    return res.json({
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (err) {
    console.error("Error in getTransactions:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transactions.find();

    return res.json({
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (err) {
    console.error("Error in getTransactions:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
