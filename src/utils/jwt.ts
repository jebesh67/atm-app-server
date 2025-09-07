import jwt from "jsonwebtoken";
import User, { PublicUser } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "1d";

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

type Decoded = {
  sub: string;
  iat: number;
  exp: number;
};

export async function getUserFromJwtToken(
  token: string
): Promise<PublicUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Decoded;

    const user = await User.findById(decoded.sub, "_id accountNumber name balance")
      .lean<PublicUser>()
      .exec();

    return user || null;
  } catch (err) {
    console.error("Invalid or expired token:", err);
    return null;
  }
}
