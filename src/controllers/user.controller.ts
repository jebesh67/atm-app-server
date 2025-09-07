import { Request, Response } from "express";
import User, { PublicUser } from "../models/user.model";
import { getUserFromJwtToken } from "../utils/jwt";
import Transactions from "../models/transaction.model";

export const getUserFromToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    const user: PublicUser | null = await getUserFromJwtToken(token);

    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    return res.json({ user, message: "User fetched successfully!" });
  } catch (err) {
    console.error("Error in getUserFromToken controller:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const manageWithdrawal = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const user: PublicUser | null = await getUserFromJwtToken(token);
    if (!user)
      return res.status(401).json({ message: "Invalid or expired token" });

    const { amount } = req.body;
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdraw amount" });
    }

    const userDoc = await User.findById(user._id);
    if (!userDoc) return res.status(404).json({ message: "User not found" });

    if (userDoc.balance - amount <= 1000) {
      return res
        .status(400)
        .json({ message: "Minimum balance of 1000 must be maintained" });
    }

    if (userDoc.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    userDoc.balance -= amount;
    await userDoc.save();

    await Transactions.create({
      accountNumber: userDoc.accountNumber,
      type: "withdrawal",
      amount,
      balanceAfter: userDoc.balance,
      status: "completed",
    });

    return res.json({
      success: true,
      message: `Withdrawn ${amount} successfully`,
      balance: userDoc.balance,
    });
  } catch (err) {
    console.error("Error in manageWithdrawal:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const manageDeposit = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const user: PublicUser | null = await getUserFromJwtToken(token);
    if (!user)
      return res.status(401).json({ message: "Invalid or expired token" });

    const { amount } = req.body;
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }

    const userDoc = await User.findById(user._id);
    if (!userDoc) return res.status(404).json({ message: "User not found" });

    userDoc.balance += amount;
    await userDoc.save();

    await Transactions.create({
      accountNumber: userDoc.accountNumber,
      type: "deposit",
      amount,
      balanceAfter: userDoc.balance,
      status: "completed",
    });

    return res.json({
      success: true,
      message: `Deposited ${amount} successfully`,
      balance: userDoc.balance,
    });
  } catch (err) {
    console.error("Error in manageDeposit:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
