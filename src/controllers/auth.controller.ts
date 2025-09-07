import { Request, Response } from "express";
import User, { PublicUser } from "../models/user.model";
import { signJwt, verifyJwt } from "../utils/jwt";
import { compareData } from "../utils/bcrypt";

export const getUser = async (req: Request, res: Response) => {
  try {
    interface LoginInput {
      accountNumber: string;
      atmPin: string;
    }
    
    const {accountNumber, atmPin} = req.body as LoginInput;
    
    const user = await User.findOne({accountNumber});
    if (!user) {
      return res.status(401).json({message: "Invalid credentials"});
    }
    
    const isMatch = await compareData(atmPin, user.atmPin);
    if (!isMatch) {
      return res.status(401).json({message: "Invalid credentials"});
    }
    
    const safeUser: PublicUser = {
      _id: user._id.toString(),
      accountNumber: user.accountNumber,
      name: user.name,
      balance: user.balance,
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

export const checkAuth = (req: Request, res: Response) => {
  try {
    const token = req.cookies["token"];
    
    if (!token) {
      return res
        .status(401)
        .json({accessStatus: false, message: "No token provided"});
    }
    
    const payload = verifyJwt(token);
    if (!payload) {
      return res
        .status(403)
        .json({accessStatus: false, message: "Invalid token"});
    }
    
    return res.json({accessStatus: true, message: "Access granted", payload});
  } catch (err) {
    console.error("checkAuth error:", err);
    return res
      .status(500)
      .json({accessStatus: false, message: "Server error"});
  }
};

export const checkAdminAuth = (req: Request, res: Response) => {
  try {
    const token = req.cookies["adminToken"];
    
    if (!token) {
      return res
        .status(401)
        .json({accessStatus: false, message: "No token provided"});
    }
    
    const payload = verifyJwt(token);
    if (!payload) {
      return res
        .status(403)
        .json({accessStatus: false, message: "Invalid token"});
    }
    
    return res.json({accessStatus: true, message: "Access granted", payload});
  } catch (err) {
    console.error("checkAuth error:", err);
    return res
      .status(500)
      .json({accessStatus: false, message: "Server error"});
  }
};
