import Return from "../models/Return.js";

export const analyzeReturn = async (req, res) => {
  try {
    const {
      orderId,
      orderAmount,
      returnCount,
      returnReason,
    } = req.body;

    if (!orderId || orderAmount === undefined) {
      return res.status(400).json({
        message: "Order ID and order amount are required",
      });
    }

    let riskScore = 0;

    // =========================
    // RETURN COUNT RISK
    // =========================

    if (Number(returnCount) >= 10) {
      riskScore += 60;
    } else if (Number(returnCount) >= 5) {
      riskScore += 45;
    } else if (Number(returnCount) >= 3) {
      riskScore += 30;
    } else {
      riskScore += 10;
    }

    // =========================
    // ORDER AMOUNT RISK
    // =========================

    if (Number(orderAmount) >= 50000) {
      riskScore += 30;
    } else if (Number(orderAmount) >= 20000) {
      riskScore += 20;
    } else {
      riskScore += 5;
    }

    // =========================
    // RETURN REASON RISK
    // =========================

    if (
      returnReason === "Damaged" ||
      returnReason === "Wrong Item"
    ) {
      riskScore += 5;
    } else if (
      returnReason === "Changed Mind"
    ) {
      riskScore += 2;
    }

    // =========================
    // LIMIT SCORE
    // =========================

    riskScore = Math.min(riskScore, 100);

    // =========================
    // RISK LEVEL
    // =========================

    let riskLevel = "Low";

    if (riskScore >= 60) {
      riskLevel = "High";
    } else if (riskScore >= 35) {
      riskLevel = "Medium";
    }

    // =========================
    // CREATE RETURN
    // =========================

    const newReturn = await Return.create({
      userId: req.user.id,

      orderId,

      orderAmount: Number(orderAmount),

      returnCount: Number(returnCount || 0),

      returnReason: returnReason || "Not specified",

      riskScore,

      riskProbability: riskScore,

      riskLevel,
    });

    // =========================
    // RESPONSE
    // =========================

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
};


// =====================================
// GET RETURNS
// =====================================

export const getReturns = async (req, res) => {
  try {
    const returns = await Return.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    console.log(
      "User:",
      req.user.id
    );

    console.log(
      "Returns:",
      returns.length
    );

    res.json(returns);

  } catch (error) {
    console.error(
      "Get returns error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch returns",
    });
  }
};