import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    orderId: {
      type: String,
      required: true,
    },

    orderAmount: {
      type: Number,
      required: true,
    },

    returnCount: {
      type: Number,
      default: 0,
    },

    returnReason: {
      type: String,
      default: "Not specified",
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Return", returnSchema);