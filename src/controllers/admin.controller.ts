import { Request, Response } from "express";
import { signJwt } from "../utils/jwt";
import { Types } from "mongoose";
import Admin, { IAdmin, PublicAdmin } from "../models/admin.model";
import User from "../models/user.model";
import { hashData } from "../utils/bcrypt";

export const getAdmin = async (req: Request, res: Response) => {
  try {
    interface LoginInput {
      username: string;
      password: string;
    }
    
    const {username, password} = req.body as LoginInput;
    
    type LeanPublicUser = Pick<IAdmin, "username" | "name" | "_id">;
    
    const user: (LeanPublicUser & { _id: Types.ObjectId }) | null =
      await Admin.findOne({username, password})
        .select("username name _id")
        .lean();
    
    if (!user) {
      return res.status(401).json({message: "Invalid credentials"});
    }
    
    const safeUser: PublicAdmin = {
      _id: user._id.toString(),
      username: user.username,
      name: user.name,
    };
    
    const token = signJwt({sub: safeUser._id});
    
    return res.json({
      message: "Login successful",
      user: safeUser,
      token: token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({message: "Server error"});
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await User.find()
      .select("name accountNumber _id balance createdAt")
      .lean();
    
    return res.json({
      message: "Customers fetched successfully",
      users: customers,
    });
  } catch (err) {
    console.error("Fetch customers error:", err);
    return res.status(500).json({message: "Server error"});
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const {name, accountNumber, atmPin, balance = 0} = req.body;
    
    if (!name || !accountNumber || !atmPin) {
      return res
        .status(400)
        .json({message: "Name, Account Number, and ATM PIN are required"});
    }
    
    const existingUser = await User.findOne({accountNumber});
    if (existingUser) {
      return res
        .status(400)
        .json({message: "User with this Account Number already exists"});
    }
    
    const hashedAtmPin = await hashData(atmPin);
    
    const newUser = new User({
      name,
      accountNumber,
      atmPin: hashedAtmPin,
      balance,
    });
    
    await newUser.save();
    
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    console.error("Error in createUser:", err);
    return res.status(500).json({message: "Internal server error"});
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const {id, name, accountNumber} = req.body;
    
    if (!id || !name || !accountNumber) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    
    const existingUser = await User.findOne({
      accountNumber,
      _id: {$ne: id},
    });
    
    if (existingUser) {
      return res.status(400).json({
        message: "Account number already in use by another user",
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {name, accountNumber},
      {new: true},
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    
    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const {userId}: { userId: string } = req.body;
    
    if (!userId) {
      return res.status(400).json({success: false, message: "userId is required"});
    }
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({success: false, message: "User not found"});
    }
    
    return res.json({success: true, message: "User deleted successfully"});
  } catch (err) {
    return res.status(500).json({success: false, message: "Server error"});
  }
};
