import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import riskRoutes from "./routes/risk.route.js";
import returnRoutes from "./routes/return.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/returns", returnRoutes);

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "AI Risk Manager API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});