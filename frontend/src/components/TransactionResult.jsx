import RiskBadge from "./RiskBadge";
import RiskSummary from "./RiskSummary";
import RiskChart from "./RiskChart";
import "./TransactionResult.css";

function TransactionResult({ result }) {
if (!result) {
return null;
}

const prediction =
result.prediction ||
result.status ||
"Unknown";

const riskLevel =
result.riskLevel ||
result.risk ||
"Unknown";

const fraudProbability = Number(
result.fraudProbability ??
result.probability ??
0
);

const transactionAmount = Number(
result.transactionAmount ??
result.amount ??
0
);

const isFraud =
String(prediction).toLowerCase() === "fraud" ||
String(result.status).toLowerCase() === "fraud";

return (
<div
className={`transaction-result ${
        isFraud
          ? "transaction-result-fraud"
          : "transaction-result-safe"
      }`}
>


  <div className="transaction-result-header">

    <div>
      <span className="transaction-result-label">
        AI TRANSACTION ANALYSIS
      </span>

      <h2>
        {isFraud
          ? "Potential Fraud Detected"
          : "Transaction Appears Legitimate"}
      </h2>

      <p>
        The transaction has been analyzed by
        the fraud detection model.
      </p>
    </div>

    <RiskBadge
      riskLevel={
        isFraud
          ? riskLevel
          : "Legitimate"
      }
    />

  </div>


  <RiskSummary
    prediction={prediction}
    fraudProbability={fraudProbability}
    riskLevel={riskLevel}
    transactionAmount={transactionAmount}
  />


  <RiskChart
    fraudProbability={fraudProbability}
  />


  <div
    className={`transaction-action ${
      isFraud
        ? "transaction-action-danger"
        : "transaction-action-safe"
    }`}
  >

    <h3>
      {isFraud
        ? "⚠️ Recommended Action"
        : "✓ Recommended Action"}
    </h3>

    <p>
      {isFraud
        ? "Review the transaction and verify the customer and payment details before approving it."
        : "No strong fraud indicators were detected. The transaction can proceed through your normal verification process."}
    </p>

  </div>

</div>

);
}

export default TransactionResult;
