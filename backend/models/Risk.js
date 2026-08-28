import mongoose from "mongoose";

const riskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    transactionAmount: {
      type: Number,
      required: true,
    },

    deviceNew: {
      type: Boolean,
      default: false,
    },

    unusualLocation: {
      type: Boolean,
      default: false,
    },

    failedAttempts: {
      type: Number,
      default: 0,
    },

    transactionsLastHour: {
      type: Number,
      default: 0,
    },

    accountAgeDays: {
      type: Number,
      default: 0,
    },

    fraudProbability: {
      type: Number,
      required: true,
    },

    prediction: {
      type: String,
      enum: ["Fraud", "Legitimate"],
      required: true,
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
    },

    recommendation: {
      type: String,
      default: "No recommendation available.",
    },
  },
  {
    timestamps: true,
  }
);

const Risk = mongoose.model(
  "Risk",
  riskSchema
);

export default Risk;