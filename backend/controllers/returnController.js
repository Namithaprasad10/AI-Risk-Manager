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
      returnReason === "Damaged" ||
      returnReason === "Wrong Item"
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
      userId: req.user.id, // IMPORTANT

      orderId,

      orderAmount: Number(orderAmount),

      returnCount: Number(returnCount || 0),

      returnReason,

      riskScore,

      riskLevel,
    });

    res.status(201).json({
      message: "Return analyzed successfully",
      return: newReturn,
    });

  } catch (error) {
    console.error("Return analysis error:", error);

    res.status(500).json({
      message: "Failed to analyze return",
    });
  }
};


export const getReturns = async (req, res) => {
  try {
    // IMPORTANT: ONLY THIS LOGGED-IN USER'S RETURNS

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