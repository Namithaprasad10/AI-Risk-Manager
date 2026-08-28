import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import "./CheckTransaction.css";

function CheckTransaction() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    transactionAmount: "",
    deviceNew: false,
    unusualLocation: false,
    failedAttempts: "",
    transactionsLastHour: "",
    accountAgeDays: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  // =========================
  // HANDLE IMAGE
  // =========================

  const handleImageSelect = (file) => {
    setSelectedImage(file);
  };

  // =========================
  // ANALYZE TRANSACTION
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "api/risk/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...formData,

            transactionAmount:
              Number(
                formData.transactionAmount
              ),

            failedAttempts:
              Number(
                formData.failedAttempts
              ),

            transactionsLastHour:
              Number(
                formData.transactionsLastHour
              ),

            accountAgeDays:
              Number(
                formData.accountAgeDays
              ),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Risk analysis failed"
        );
      }

      setResult(data.result);

    } catch (error) {
      console.error(
        "Analysis error:",
        error
      );

      setError(
        error.message ||
          "Unable to analyze transaction"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="check-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="check-header">

        <div>
          <h1>
            Check Transaction
          </h1>

          <p>
            Analyze a transaction for
            potential fraud risk.
          </p>
        </div>

        <button
          className="dashboard-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Dashboard
        </button>

      </div>


      {/* =========================
          TWO COLUMN LAYOUT
      ========================= */}

      <div className="check-layout">

        {/* =========================
            FORM
        ========================= */}

        <div className="check-card">

          <h2>
            Transaction Details
          </h2>

          <form
            onSubmit={handleSubmit}
          >

            {/* TRANSACTION AMOUNT */}

            <div className="form-group">

              <label>
                Transaction Amount
              </label>

              <input
                type="number"
                name="transactionAmount"
                value={
                  formData.transactionAmount
                }
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
                required
              />

            </div>


            {/* FAILED ATTEMPTS */}

            <div className="form-group">

              <label>
                Failed Attempts
              </label>

              <input
                type="number"
                name="failedAttempts"
                value={
                  formData.failedAttempts
                }
                onChange={handleChange}
                placeholder="e.g. 2"
                min="0"
                required
              />

            </div>


            {/* TRANSACTIONS LAST HOUR */}

            <div className="form-group">

              <label>
                Transactions in Last Hour
              </label>

              <input
                type="number"
                name="transactionsLastHour"
                value={
                  formData.transactionsLastHour
                }
                onChange={handleChange}
                placeholder="e.g. 4"
                min="0"
                required
              />

            </div>


            {/* ACCOUNT AGE */}

            <div className="form-group">

              <label>
                Account Age (Days)
              </label>

              <input
                type="number"
                name="accountAgeDays"
                value={
                  formData.accountAgeDays
                }
                onChange={handleChange}
                placeholder="e.g. 120"
                min="0"
                required
              />

            </div>


            {/* CHECKBOXES */}

            <div className="checkbox-row">

              <label>

                <input
                  type="checkbox"
                  name="deviceNew"
                  checked={
                    formData.deviceNew
                  }
                  onChange={handleChange}
                />

                New Device

              </label>


              <label>

                <input
                  type="checkbox"
                  name="unusualLocation"
                  checked={
                    formData.unusualLocation
                  }
                  onChange={handleChange}
                />

                Unusual Location

              </label>

            </div>


            {/* =========================
                IMAGE UPLOAD
            ========================= */}

            <ImageUpload
              onImageSelect={
                handleImageSelect
              }
            />


            {/* ERROR */}

            {error && (
              <div className="check-error">
                {error}
              </div>
            )}


            {/* ANALYZE BUTTON */}

            <button
              type="submit"
              className="analyze-button"
              disabled={loading}
            >

              {loading
                ? "Analyzing..."
                : "Analyze Risk"}

            </button>

          </form>

        </div>


        {/* =========================
            RESULT
        ========================= */}

        {result && (

          <div className="result-card">

            <h2>
              Risk Assessment
            </h2>


            <div
              className={`result-status ${
                result.prediction ===
                "Fraud"
                  ? "fraud"
                  : "legitimate"
              }`}
            >

              {result.prediction ===
              "Fraud"
                ? "⚠️ Fraud Risk Detected"
                : "✓ Transaction Appears Legitimate"}

            </div>


            <div className="result-info">

              <div>
                <span>
                  Fraud Probability
                </span>

                <strong>
                  {
                    result.fraudProbability
                  }%
                </strong>
              </div>


              <div>
                <span>
                  Risk Level
                </span>

                <strong>
                  {result.riskLevel}
                </strong>
              </div>


              <div>
                <span>
                  Transaction Amount
                </span>

                <strong>
                  ₹
                  {
                    result.transactionAmount
                  }
                </strong>
              </div>

            </div>


            <p className="result-message">

              {result.prediction ===
              "Fraud"
                ? "This transaction contains multiple risk signals and should be reviewed."
                : "No strong fraud indicators were detected for this transaction."}

            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default CheckTransaction;