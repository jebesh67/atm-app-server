import mongoose, { Schema, Document, Types } from "mongoose";

export type PublicUser = {
  _id: string;
  accountNumber: string;
  name: string;
  balance: number;
};

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  accountNumber: string;
  atmPin: string;
  balance: number;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    atmPin: { type: String, required: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
