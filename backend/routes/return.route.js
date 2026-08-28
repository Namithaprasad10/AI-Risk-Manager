import express from "express";
import Return from "../models/Return.js";

const router = express.Router();

// Get all returns
router.get("/", async (req, res) => {
  try {
    const returns = await Return.find().sort({
      createdAt: -1,
    });

    res.json(returns);
  } catch (error) {
    console.error("Return fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch returns",
    });
  }
});


// Analyze a return
router.post("/analyze", async (req, res) => {
  try {
    const {
      userId,
      orderId,
      orderAmount,
      returnCount,
      returnReason,
    } = req.body;

    if (
      !userId ||
      !orderId ||
      !orderAmount
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Simple risk calculation
    let riskScore = 0;

    if (Number(returnCount) >= 5) {
      riskScore += 50;
    } else if (Number(returnCount) >= 3) {
      riskScore += 30;
    } else {
      riskScore += 10;
    }

    if (Number(orderAmount) >= 50000) {
      riskScore += 30;
    } else if (Number(orderAmount) >= 20000) {
      riskScore += 20;
    } else {
      riskScore += 5;
    }

    if (
      returnReason === "Damaged"
      || returnReason === "Wrong Item"
    ) {
      riskScore += 5;
    }

    let riskLevel = "Low";

    if (riskScore >= 60) {
      riskLevel = "High";
    } else if (riskScore >= 35) {
      riskLevel = "Medium";
    }

    const newReturn = await Return.create({
      userId,
      orderId,
      orderAmount: Number(orderAmount),
      returnCount: Number(returnCount),
      returnReason,
      riskScore,
      riskLevel,
    });

    res.status(201).json({
      message: "Return analyzed successfully",
      return: newReturn,
    });

  } catch (error) {
    console.error(
      "Return analysis error:",
      error
    );

    res.status(500).json({
      message: "Failed to analyze return",
    });
  }
});


export default router;