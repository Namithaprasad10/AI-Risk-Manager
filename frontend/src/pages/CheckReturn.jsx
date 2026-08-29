import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import ReturnRiskResult from "../components/ReturnRiskResult";
import "./CheckReturn.css";

function CheckReturn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    orderId: "",
    orderAmount: "",
    returnCount: "",
    returnReason: "Damaged",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE IMAGE
  // =========================

  const handleImageSelect = (file) => {
    setSelectedImage(file);
  };

  // =========================
  // ANALYZE RETURN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "/api/returns/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...formData,

            orderAmount: Number(
              formData.orderAmount
            ),

            returnCount: Number(
              formData.returnCount
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Return analysis failed"
        );
      }

      setResult(
        data.return || data.result
      );

    } catch (error) {
      console.error(
        "Return error:",
        error
      );

      setError(
        error.message ||
          "Unable to analyze return"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="check-return-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="check-return-header">

        <div>
          <h1>Check Return</h1>

          <p>
            Analyze return activity and
            identify potential return risk.
          </p>
        </div>

        <button
          type="button"
          className="back-button"
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

      <div className="check-return-layout">

        {/* =========================
            RETURN DETAILS
        ========================= */}

        <div className="check-return-card">

          <h2>Return Details</h2>

          <form onSubmit={handleSubmit}>


            {/* ORDER ID */}

            <div className="return-field">

              <label>
                Order ID
              </label>

              <input
                type="text"
                name="orderId"
                placeholder="Enter order ID"
                value={formData.orderId}
                onChange={handleChange}
                required
              />

            </div>


            {/* ORDER AMOUNT */}

            <div className="return-field">

              <label>
                Order Amount
              </label>

              <input
                type="number"
                name="orderAmount"
                placeholder="Enter order amount"
                value={formData.orderAmount}
                onChange={handleChange}
                min="0"
                required
              />

            </div>


            {/* RETURN COUNT */}

            <div className="return-field">

              <label>
                Previous Return Count
              </label>

              <input
                type="number"
                name="returnCount"
                placeholder="Number of previous returns"
                value={formData.returnCount}
                onChange={handleChange}
                min="0"
                required
              />

            </div>


            {/* RETURN REASON */}

            <div className="return-field">

              <label>
                Return Reason
              </label>

              <select
                name="returnReason"
                value={formData.returnReason}
                onChange={handleChange}
              >

                <option value="Damaged">
                  Damaged
                </option>

                <option value="Wrong Item">
                  Wrong Item
                </option>

                <option value="Changed Mind">
                  Changed Mind
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* =========================
                IMAGE UPLOAD COMPONENT
            ========================= */}

            <ImageUpload
              onImageSelect={
                handleImageSelect
              }
            />


            {/* ERROR */}

            {error && (
              <div className="return-error">
                {error}
              </div>
            )}


            {/* BUTTON */}

            <button
              type="submit"
              className="analyze-return-button"
              disabled={loading}
            >

              {loading
                ? "Analyzing..."
                : "Analyze Return"}

            </button>

          </form>

        </div>


        {/* =========================
            RETURN RISK RESULT
        ========================= */}

        {result && (
          <ReturnRiskResult
            result={result}
          />
        )}

      </div>

    </div>
  );
}

export default CheckReturn;