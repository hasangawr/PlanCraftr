import express from "express";
import authRoutes from "./routes/authRoutes";
import connectDB from "./utils/db";
import cors from "cors";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require("cookie-parser");

const app = express();

connectDB();

const corsOptions = {
  origin: "http://localhost:5000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to PlanCraftr!");
});
app.use("/auth", authRoutes);

export default app;
