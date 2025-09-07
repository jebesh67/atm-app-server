import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL || "";

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected");
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${ PORT }`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

startServer();
