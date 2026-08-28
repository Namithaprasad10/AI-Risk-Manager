import json
import os
import sys

import joblib
import pandas as pd


# ============================================================
# MODEL PATH
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "fraud_model.pkl"
)


# ============================================================
# LOAD MODEL
# ============================================================

try:
    model = joblib.load(MODEL_PATH)

except Exception as error:
    print(
        json.dumps({
            "success": False,
            "message": f"Could not load fraud model: {str(error)}"
        })
    )
    sys.exit(1)


# ============================================================
# FEATURES
# IMPORTANT:
# These must match train_model.py
# ============================================================

FEATURES = [
    "transactionAmount",
    "deviceNew",
    "unusualLocation",
    "failedAttempts",
    "transactionsLastHour",
    "accountAgeDays",
]


# ============================================================
# RISK LEVEL
# ============================================================

def get_risk_level(probability):

    if probability >= 80:
        return "Critical"

    elif probability >= 60:
        return "High"

    elif probability >= 30:
        return "Medium"

    else:
        return "Low"


# ============================================================
# RECOMMENDATION
# ============================================================

def get_recommendation(
    prediction,
    risk_level,
    data
):

    if prediction == "Fraud":

        if risk_level == "Critical":
            return (
                "Block the transaction and require "
                "additional identity verification."
            )

        elif risk_level == "High":
            return (
                "Hold the transaction for manual review "
                "and verify the customer's identity."
            )

        else:
            return (
                "Monitor the transaction and consider "
                "additional verification."
            )

    # Legitimate transaction

    if (
        data["deviceNew"]
        and data["unusualLocation"]
    ):
        return (
            "Transaction appears legitimate, but "
            "monitor the new device and unusual location."
        )

    return (
        "Transaction appears legitimate. "
        "No immediate action is required."
    )


# ============================================================
# PREDICT FRAUD
# ============================================================

def predict_transaction(data):

    # --------------------------------------------------------
    # Convert input values
    # --------------------------------------------------------

    transaction_amount = float(
        data["transactionAmount"]
    )

    device_new = bool(
        data["deviceNew"]
    )

    unusual_location = bool(
        data["unusualLocation"]
    )

    failed_attempts = int(
        data["failedAttempts"]
    )

    transactions_last_hour = int(
        data["transactionsLastHour"]
    )

    account_age_days = int(
        data["accountAgeDays"]
    )


    # --------------------------------------------------------
    # Create DataFrame
    # --------------------------------------------------------

    input_data = pd.DataFrame(
        [[
            transaction_amount,
            int(device_new),
            int(unusual_location),
            failed_attempts,
            transactions_last_hour,
            account_age_days,
        ]],
        columns=FEATURES
    )


    # --------------------------------------------------------
    # Model prediction
    # --------------------------------------------------------

    prediction_value = model.predict(
        input_data
    )[0]


    # --------------------------------------------------------
    # Fraud probability
    #
    # predict_proba gives:
    #
    # [probability of legitimate,
    #  probability of fraud]
    # --------------------------------------------------------

    probabilities = model.predict_proba(
        input_data
    )[0]

    fraud_probability = float(
        probabilities[1] * 100
    )


    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    if prediction_value == 1:

        prediction = "Fraud"

    else:

        prediction = "Legitimate"


    # --------------------------------------------------------
    # Risk level
    # --------------------------------------------------------

    risk_level = get_risk_level(
        fraud_probability
    )


    # --------------------------------------------------------
    # Recommendation
    # --------------------------------------------------------

    recommendation = get_recommendation(
        prediction,
        risk_level,
        {
            "deviceNew": device_new,
            "unusualLocation": unusual_location,
        }
    )


    # --------------------------------------------------------
    # Result
    # --------------------------------------------------------

    return {
        "success": True,

        "prediction": prediction,

        "fraudProbability": round(
            fraud_probability,
            2
        ),

        "riskLevel": risk_level,

        "recommendation": recommendation,
    }


# ============================================================
# MAIN
# ============================================================

def main():

    try:

        # ----------------------------------------------------
        # Read JSON from command line
        # ----------------------------------------------------

        if len(sys.argv) > 1:

            input_json = sys.argv[1]

        else:

            input_json = sys.stdin.read()


        if not input_json.strip():

            raise ValueError(
                "No transaction data provided."
            )


        data = json.loads(
            input_json
        )


        # ----------------------------------------------------
        # Validate required fields
        # ----------------------------------------------------

        missing_fields = [
            field
            for field in FEATURES
            if field not in data
        ]


        if missing_fields:

            raise ValueError(
                "Missing fields: "
                + ", ".join(missing_fields)
            )


        # ----------------------------------------------------
        # Run prediction
        # ----------------------------------------------------

        result = predict_transaction(
            data
        )


        # ----------------------------------------------------
        # Return JSON
        # ----------------------------------------------------

        print(
            json.dumps(
                result
            )
        )


    except Exception as error:

        print(
            json.dumps({
                "success": False,
                "message": str(error)
            })
        )

        sys.exit(1)


# ============================================================
# START
# ============================================================

if __name__ == "__main__":
    main()