import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import projectRoutes from "./routes/project.routes";

dotenv.config();

const app = express();
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use("/backend", projectRoutes);

export default app;
