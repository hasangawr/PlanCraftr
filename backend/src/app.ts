import express from "express";
import authRoutes from "./routes/authRoutes";
import connectDB from "./utils/db";
import cors from "cors";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to PlanCraftr!");
});
app.use("/auth", authRoutes);

export default app;
