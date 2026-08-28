import "./RiskRecommendation.css";

function RiskRecommendation({ result }) {
if (!result) {
return null;
}

const riskLevel =
result.riskLevel ||
result.risk ||
"";

const prediction =
result.prediction ||
result.status ||
"";

const probability = Number(
result.fraudProbability ??
result.probability ??
0
);

const risk = String(riskLevel).toLowerCase();
const status = String(prediction).toLowerCase();

const isFraud =
status === "fraud" ||
risk === "high" ||
risk === "critical" ||
probability >= 75;

const isMediumRisk =
risk === "medium" ||
(probability >= 40 && probability < 75);

let title;
let message;
let actions;
let className;

if (isFraud) {
title = "High Risk — Review Required";
message =
"This transaction shows strong indicators of potential fraud. Do not approve it automatically.";
actions = [
"Verify the customer's identity.",
"Check the payment and transaction details.",
"Review previous transactions from this user.",
"Consider holding or rejecting the transaction.",
];
className = "recommendation-high";
} else if (isMediumRisk) {
title = "Medium Risk — Verify Before Approval";
message =
"Some risk indicators were detected. Additional verification is recommended before completing the transaction.";
actions = [
"Verify customer and payment information.",
"Review unusual transaction behaviour.",
"Request additional verification if necessary.",
];
className = "recommendation-medium";
} else {
title = "Low Risk — Transaction Appears Safe";
message =
"The model did not detect strong fraud indicators in this transaction.";
actions = [
"Continue with the normal transaction process.",
"Keep monitoring future activity from this user.",
];
className = "recommendation-low";
}

return (
<div className={`risk-recommendation ${className}`}>


  <div className="recommendation-header">

    <div className="recommendation-icon">
      {isFraud ? "⚠️" : isMediumRisk ? "🔎" : "✓"}
    </div>

    <div>
      <span className="recommendation-label">
        AI RECOMMENDATION
      </span>

      <h3>{title}</h3>
    </div>

  </div>

  <p className="recommendation-message">
    {message}
  </p>

  <div className="recommendation-actions">

    <strong>
      Recommended Actions
    </strong>

    <ul>
      {actions.map((action, index) => (
        <li key={index}>
          {action}
        </li>
      ))}
    </ul>

  </div>

</div>

);
}

export default RiskRecommendation;
