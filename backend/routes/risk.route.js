import express from "express";
import jwt from "jsonwebtoken";

import {
  analyzeTransaction,
  getTransactions,
} from "../controllers/riskController.js";

const router = express.Router();

// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================

const authenticateUser = (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message:
          "Authorization header missing",
      });
    }

    if (
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message:
          "Invalid authorization format",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Support both possible JWT formats
    req.userId =
      decoded.userId ||
      decoded.id;

    // Also make req.user available
    req.user = {
      id:
        decoded.userId ||
        decoded.id,
    };

    if (!req.userId) {
      return res.status(401).json({
        message:
          "Invalid token: user ID not found",
      });
    }

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      message:
        "Invalid or expired token",
    });
  }
};

// ============================================================
// ANALYZE TRANSACTION
// ============================================================

router.post(
  "/analyze",
  authenticateUser,
  analyzeTransaction
);

// ============================================================
// GET USER TRANSACTIONS
// ============================================================

router.get(
  "/transactions",
  authenticateUser,
  getTransactions
);

export default router;