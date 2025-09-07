import mongoose, { Schema, Document, Types } from "mongoose";

export type PublicAdmin = {
  _id: string;
  username: string;
  name: string;
};

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  password: string;
}

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
