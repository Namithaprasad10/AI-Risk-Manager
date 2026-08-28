import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import Risk from "../models/Risk.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to:
// ml-model/fraud/predict.py
const predictScript = path.join(
  __dirname,
  "../../ml-model/fraud/predict.py"
);

// ============================================================
// RUN PYTHON ML MODEL
// ============================================================

const runPrediction = (transactionData) => {
  return new Promise((resolve, reject) => {
    const pythonCommand =
      process.platform === "win32"
        ? "python"
        : "python3";

    const pythonProcess = spawn(
      pythonCommand,
      [
        predictScript,
        JSON.stringify(transactionData),
      ],
      {
        cwd: path.dirname(predictScript),
      }
    );

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(
          "Python ML error:",
          errorOutput
        );

        return reject(
          new Error(
            errorOutput ||
              "Python ML model failed."
          )
        );
      }

      try {
        const result = JSON.parse(
          output.trim()
        );

        if (!result.success) {
          return reject(
            new Error(
              result.message ||
                "ML prediction failed."
            )
          );
        }

        resolve(result);
      } catch (error) {
        console.error(
          "Invalid ML response:",
          output
        );

        reject(
          new Error(
            "Invalid response received from Python ML model."
          )
        );
      }
    });

    pythonProcess.on("error", (error) => {
      console.error(
        "Failed to start Python:",
        error
      );

      reject(
        new Error(
          "Could not start Python ML model. Make sure Python is installed and available in PATH."
        )
      );
    });
  });
};

// ============================================================
// ANALYZE TRANSACTION
// ============================================================

export const analyzeTransaction = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({
        message:
          "User authentication required.",
      });
    }

    const {
      transactionAmount,
      deviceNew,
      unusualLocation,
      failedAttempts,
      transactionsLastHour,
      accountAgeDays,
    } = req.body;

    if (
      transactionAmount === undefined ||
      failedAttempts === undefined ||
      transactionsLastHour === undefined ||
      accountAgeDays === undefined
    ) {
      return res.status(400).json({
        message:
          "Please provide all transaction details.",
      });
    }

    const amount = Number(
      transactionAmount
    );

    const failed = Number(
      failedAttempts
    );

    const lastHour = Number(
      transactionsLastHour
    );

    const accountAge = Number(
      accountAgeDays
    );

    const newDevice =
      deviceNew === true ||
      deviceNew === "true";

    const strangeLocation =
      unusualLocation === true ||
      unusualLocation === "true";

    if (
      !Number.isFinite(amount) ||
      !Number.isFinite(failed) ||
      !Number.isFinite(lastHour) ||
      !Number.isFinite(accountAge)
    ) {
      return res.status(400).json({
        message:
          "Transaction values must be valid numbers.",
      });
    }

    if (
      amount < 0 ||
      failed < 0 ||
      lastHour < 0 ||
      accountAge < 0
    ) {
      return res.status(400).json({
        message:
          "Transaction values cannot be negative.",
      });
    }

    const transactionData = {
      transactionAmount: amount,
      deviceNew: newDevice,
      unusualLocation: strangeLocation,
      failedAttempts: failed,
      transactionsLastHour: lastHour,
      accountAgeDays: accountAge,
    };

    console.log(
      "Sending transaction to ML model:",
      transactionData
    );

    // CALL PYTHON ML MODEL
    const prediction =
      await runPrediction(
        transactionData
      );

    console.log(
      "ML prediction:",
      prediction
    );

    const {
      prediction: predictionResult,
      fraudProbability,
      riskLevel,
      recommendation,
    } = prediction;

    // SAVE ML RESULT TO MONGODB
    const risk = await Risk.create({
      userId,

      transactionAmount: amount,

      deviceNew: newDevice,

      unusualLocation:
        strangeLocation,

      failedAttempts: failed,

      transactionsLastHour: lastHour,

      accountAgeDays: accountAge,

      fraudProbability,

      prediction:
        predictionResult,

      riskLevel,

      recommendation:
        recommendation ||
        "No recommendation available.",
    });

    return res.status(201).json({
      message:
        "Transaction analyzed successfully.",

      result: {
        _id: risk._id,

        transactionAmount:
          risk.transactionAmount,

        deviceNew:
          risk.deviceNew,

        unusualLocation:
          risk.unusualLocation,

        failedAttempts:
          risk.failedAttempts,

        transactionsLastHour:
          risk.transactionsLastHour,

        accountAgeDays:
          risk.accountAgeDays,

        prediction:
          risk.prediction,

        fraudProbability:
          risk.fraudProbability,

        riskLevel:
          risk.riskLevel,

        recommendation:
          risk.recommendation,

        createdAt:
          risk.createdAt,
      },

      transaction: risk,
    });
  } catch (error) {
    console.error(
      "Transaction analysis error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Server error while analyzing transaction.",
    });
  }
};

// ============================================================
// GET USER TRANSACTIONS
// ============================================================

export const getTransactions = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({
        message:
          "User authentication required.",
      });
    }

    const transactions =
      await Risk.find({
        userId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(50);

    return res.status(200).json(
      transactions
    );
  } catch (error) {
    console.error(
      "Transaction fetch error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while fetching transactions.",
    });
  }
};