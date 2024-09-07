import express from "express";
import authRoutes from "./routes/authRoutes";

const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to PlanCraftr!");
});
app.use("/auth", authRoutes);

export default app;
