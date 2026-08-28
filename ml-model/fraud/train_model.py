import json
import os

import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split


# ============================================================
# CONFIGURATION
# ============================================================

RANDOM_STATE = 42
NUMBER_OF_TRANSACTIONS = 5000

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "fraud_model.pkl"
)

METRICS_PATH = os.path.join(
    BASE_DIR,
    "metrics.json"
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "fraud_dataset.csv"
)


# ============================================================
# 1. CREATE TRANSACTION DATASET
# ============================================================

print("\nCreating transaction dataset...")

np.random.seed(RANDOM_STATE)

data = []

for _ in range(NUMBER_OF_TRANSACTIONS):

    transaction_amount = round(
        np.random.uniform(100, 100000),
        2
    )

    device_new = np.random.choice(
        [0, 1],
        p=[0.75, 0.25]
    )

    unusual_location = np.random.choice(
        [0, 1],
        p=[0.80, 0.20]
    )

    failed_attempts = np.random.poisson(1)

    failed_attempts = min(
        failed_attempts,
        8
    )

    transactions_last_hour = np.random.poisson(3)

    transactions_last_hour = min(
        transactions_last_hour,
        15
    )

    account_age_days = np.random.randint(
        1,
        1500
    )

    # --------------------------------------------------------
    # Generate fraud label
    #
    # This creates realistic relationships between risk
    # signals and the target label.
    # --------------------------------------------------------

    risk_score = 0

    if transaction_amount >= 50000:
        risk_score += 3

    elif transaction_amount >= 20000:
        risk_score += 2

    elif transaction_amount >= 10000:
        risk_score += 1

    if device_new == 1:
        risk_score += 2

    if unusual_location == 1:
        risk_score += 2

    if failed_attempts >= 5:
        risk_score += 3

    elif failed_attempts >= 3:
        risk_score += 2

    elif failed_attempts >= 1:
        risk_score += 1

    if transactions_last_hour >= 10:
        risk_score += 3

    elif transactions_last_hour >= 5:
        risk_score += 2

    if account_age_days <= 7:
        risk_score += 3

    elif account_age_days <= 30:
        risk_score += 2

    elif account_age_days <= 90:
        risk_score += 1

    # Add a small amount of randomness so the model
    # does not simply learn a perfect deterministic rule.

    random_noise = np.random.random()

    fraud = 1 if (
        risk_score >= 7
        or (
            risk_score >= 5
            and random_noise < 0.70
        )
        or (
            risk_score == 4
            and random_noise < 0.20
        )
    ) else 0

    data.append({
        "transactionAmount": transaction_amount,
        "deviceNew": device_new,
        "unusualLocation": unusual_location,
        "failedAttempts": failed_attempts,
        "transactionsLastHour": transactions_last_hour,
        "accountAgeDays": account_age_days,
        "fraud": fraud,
    })


df = pd.DataFrame(data)

df.to_csv(
    DATASET_PATH,
    index=False
)

print(
    f"Dataset created: {DATASET_PATH}"
)

print(
    f"Total transactions: {len(df)}"
)

print(
    f"Fraud transactions: {df['fraud'].sum()}"
)

print(
    f"Legitimate transactions: "
    f"{(df['fraud'] == 0).sum()}"
)


# ============================================================
# 2. FEATURES AND TARGET
# ============================================================

features = [
    "transactionAmount",
    "deviceNew",
    "unusualLocation",
    "failedAttempts",
    "transactionsLastHour",
    "accountAgeDays",
]

X = df[features]

y = df["fraud"]


# ============================================================
# 3. TRAIN / TEST SPLIT
# ============================================================

print("\nSplitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=RANDOM_STATE,
    stratify=y
)

print(
    f"Training samples: {len(X_train)}"
)

print(
    f"Held-out test samples: {len(X_test)}"
)


# ============================================================
# 4. TRAIN RANDOM FOREST MODEL
# ============================================================

print("\nTraining fraud detection model...")

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=RANDOM_STATE,
    class_weight="balanced"
)

model.fit(
    X_train,
    y_train
)

print("Model training completed.")


# ============================================================
# 5. PREDICT ON HELD-OUT TEST SET
# ============================================================

print("\nEvaluating model...")

y_prediction = model.predict(
    X_test
)


# ============================================================
# 6. CALCULATE METRICS
# ============================================================

accuracy = accuracy_score(
    y_test,
    y_prediction
)

precision = precision_score(
    y_test,
    y_prediction,
    zero_division=0
)

recall = recall_score(
    y_test,
    y_prediction,
    zero_division=0
)

f1 = f1_score(
    y_test,
    y_prediction,
    zero_division=0
)

confusion = confusion_matrix(
    y_test,
    y_prediction
)


# ============================================================
# 7. DISPLAY RESULTS
# ============================================================

print("\n========================================")
print("FRAUD MODEL EVALUATION")
print("========================================")

print(
    f"Accuracy : {accuracy:.4f}"
)

print(
    f"Precision: {precision:.4f}"
)

print(
    f"Recall   : {recall:.4f}"
)

print(
    f"F1 Score : {f1:.4f}"
)

print("\nConfusion Matrix:")

print(confusion)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_prediction,
        target_names=[
            "Legitimate",
            "Fraud"
        ],
        zero_division=0
    )
)


# ============================================================
# 8. FEATURE IMPORTANCE
# ============================================================

feature_importance = {}

for feature, importance in zip(
    features,
    model.feature_importances_
):
    feature_importance[feature] = round(
        float(importance),
        4
    )

print("\nFeature Importance:")

for feature, importance in feature_importance.items():

    print(
        f"{feature}: {importance}"
    )


# ============================================================
# 9. SAVE MODEL
# ============================================================

joblib.dump(
    model,
    MODEL_PATH
)

print(
    f"\nModel saved to: {MODEL_PATH}"
)


# ============================================================
# 10. SAVE METRICS
# ============================================================

metrics = {
    "model": "RandomForestClassifier",
    "randomState": RANDOM_STATE,
    "totalTransactions": NUMBER_OF_TRANSACTIONS,
    "trainingSamples": int(len(X_train)),
    "testSamples": int(len(X_test)),
    "accuracy": round(float(accuracy), 4),
    "precision": round(float(precision), 4),
    "recall": round(float(recall), 4),
    "f1Score": round(float(f1), 4),
    "confusionMatrix": confusion.tolist(),
    "features": features,
    "featureImportance": feature_importance,
}

with open(
    METRICS_PATH,
    "w"
) as file:

    json.dump(
        metrics,
        file,
        indent=4
    )

print(
    f"Metrics saved to: {METRICS_PATH}"
)


# ============================================================
# DONE
# ============================================================

print("\n========================================")
print("FRAUD MODEL READY")
print("========================================")

print("\nGenerated files:")

print("1. fraud_dataset.csv")
print("2. fraud_model.pkl")
print("3. metrics.json")