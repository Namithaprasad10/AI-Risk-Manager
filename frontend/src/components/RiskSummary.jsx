import RiskBadge from "./RiskBadge";
import "./RiskSummary.css";

function RiskSummary({
prediction,
fraudProbability,
riskLevel,
transactionAmount,
}) {
const probability = Number(fraudProbability || 0);

const isFraud =
String(prediction || "").toLowerCase() === "fraud";

return ( <div className="risk-summary">


  <div className="risk-summary-header">

    <div>
      <span className="risk-summary-label">
        AI RISK ANALYSIS
      </span>

      <h2>
        {isFraud
          ? "Potential Fraud Detected"
          : prediction
          ? "Transaction Appears Legitimate"
          : "Risk Analysis"}
      </h2>

      <p>
        AI analysis of the transaction risk.
      </p>
    </div>

    <RiskBadge
      riskLevel={
        isFraud
          ? riskLevel || "High"
          : prediction
          ? "Legitimate"
          : "Unknown"
      }
    />

  </div>


  <div className="risk-summary-grid">

    <div className="risk-summary-item">

      <span>Prediction</span>

      <strong>
        {prediction || "Not analyzed"}
      </strong>

    </div>


    <div className="risk-summary-item">

      <span>Fraud Probability</span>

      <strong>
        {probability.toFixed(2)}%
      </strong>

    </div>


    <div className="risk-summary-item">

      <span>Risk Level</span>

      <strong>
        {riskLevel || "Not analyzed"}
      </strong>

    </div>


    <div className="risk-summary-item">

      <span>Transaction Value</span>

      <strong>
        ₹
        {Number(
          transactionAmount || 0
        ).toLocaleString("en-IN")}
      </strong>

    </div>

  </div>


  <div className="risk-score-section">

    <div className="risk-score-header">

      <span>Fraud Risk Score</span>

      <strong>
        {probability.toFixed(0)}%
      </strong>

    </div>


    <div className="risk-score-bar">

      <div
        className="risk-score-fill"
        style={{
          width: `${Math.min(
            Math.max(probability, 0),
            100
          )}%`,
        }}
      />

    </div>

  </div>


  <div
    className={`risk-action ${
      isFraud
        ? "risk-action-danger"
        : "risk-action-safe"
    }`}
  >

    <strong>
      {isFraud
        ? "⚠️ Recommended Action"
        : "✓ Recommended Action"}
    </strong>

    <p>
      {isFraud
        ? "Review the transaction and verify the customer before approving it."
        : "No strong fraud indicators were detected. The transaction can proceed through the normal verification process."}
    </p>

  </div>

</div>

);
}

export default RiskSummary;
