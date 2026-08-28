import RiskBadge from "./RiskBadge";
import RiskChart from "./RiskChart";
import "./ReturnRiskResult.css";

function ReturnRiskResult({ result }) {
if (!result) {
return null;
}

const riskLevel =
result.riskLevel ||
result.risk ||
"Unknown";

const probability = Number(
result.returnRiskProbability ??
result.riskProbability ??
result.probability ??
0
);

const orderAmount = Number(
result.orderAmount ??
result.amount ??
0
);

const returnCount = Number(
result.returnCount || 0
);

const isHighRisk =
["high", "critical", "fraud"].includes(
String(riskLevel).toLowerCase()
) ||
probability >= 75;

return (
<div
className={`return-risk-result ${
        isHighRisk
          ? "return-risk-high"
          : "return-risk-safe"
      }`}
>

```
  <div className="return-risk-header">

    <div>
      <span className="return-risk-label">
        RETURN RISK ANALYSIS
      </span>

      <h2>
        {isHighRisk
          ? "High Return Risk Detected"
          : "Return Risk Appears Low"}
      </h2>

      <p>
        AI analysis of the customer's return
        behaviour and potential exposure.
      </p>
    </div>

    <RiskBadge
      riskLevel={
        isHighRisk
          ? riskLevel
          : "Low"
      }
    />

  </div>


  <div className="return-risk-grid">

    <div className="return-risk-item">
      <span>Risk Level</span>

      <strong>
        {riskLevel}
      </strong>
    </div>


    <div className="return-risk-item">
      <span>Risk Probability</span>

      <strong>
        {probability.toFixed(2)}%
      </strong>
    </div>


    <div className="return-risk-item">
      <span>Order Value</span>

      <strong>
        ₹
        {orderAmount.toLocaleString("en-IN")}
      </strong>
    </div>


    <div className="return-risk-item">
      <span>Return Count</span>

      <strong>
        {returnCount}
      </strong>
    </div>

  </div>


  <RiskChart
    fraudProbability={probability}
  />


  <div
    className={`return-risk-action ${
      isHighRisk
        ? "return-action-danger"
        : "return-action-safe"
    }`}
  >

    <h3>
      {isHighRisk
        ? "⚠️ Recommended Action"
        : "✓ Recommended Action"}
    </h3>

    <p>
      {isHighRisk
        ? "Review the customer's return history and order details before approving this return."
        : "The return does not currently show strong risk indicators. Continue with the normal return process."}
    </p>

  </div>

</div>

);
}

export default ReturnRiskResult;
