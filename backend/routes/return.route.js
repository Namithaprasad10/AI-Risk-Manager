import express from "express";
import jwt from "jsonwebtoken";

import {
  analyzeReturn,
  getReturns,
} from "../controllers/returnController.js";

const router = express.Router();

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token: user ID not found",
      });
    }

    req.userId = userId;

    req.user = {
      id: userId,
    };

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

router.get(
  "/",
  authenticateUser,
  getReturns
);

router.post(
  "/analyze",
  authenticateUser,
  analyzeReturn
);

export default router;