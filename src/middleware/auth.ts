import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined;
  
  if (req.path.startsWith("/admin")) {
    token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];
  } else {
    token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  }
  
  if (!token) return res.status(401).json({message: "Not authenticated"});
  
  const payload = verifyJwt(token);
  if (!payload) return res.status(401).json({message: "Invalid token"});
  
  (req as any).user = payload;
  
  next();
}
