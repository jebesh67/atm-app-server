import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  accountNumber: string;
  amount: number;
  balanceAfter: number;
  date: Date;
  status: "completed" | "pending" | "failed";
  type: "withdrawal" | "deposit";
}

const transactionSchema = new Schema<ITransaction>(
  {
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["withdrawal", "deposit"],
      required: true,
    },
  },
  { timestamps: true }
);

const Transactions = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default Transactions;
