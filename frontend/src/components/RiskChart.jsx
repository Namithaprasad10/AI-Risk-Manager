import {
ResponsiveContainer,
PieChart,
Pie,
Cell,
Tooltip,
Legend,
} from "recharts";

import "./RiskChart.css";

function RiskChart({ fraudProbability = 0 }) {
const probability = Math.min(
Math.max(Number(fraudProbability) || 0, 0),
100
);

const safeProbability = 100 - probability;

const data = [
{
name: "Fraud Risk",
value: probability,
},
{
name: "Remaining",
value: safeProbability,
},
];

return ( <div className="risk-chart-card">

```
  <div className="risk-chart-header">
    <div>
      <span className="risk-chart-label">
        RISK VISUALIZATION
      </span>

      <h3>Fraud Probability</h3>

      <p>
        Probability calculated by the ML fraud
        detection model.
      </p>
    </div>
  </div>


  <div className="risk-chart-container">

    <ResponsiveContainer
      width="100%"
      height={260}
    >

      <PieChart>

        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={75}
          outerRadius={100}
          startAngle={90}
          endAngle={-270}
          paddingAngle={2}
          dataKey="value"
        >

          <Cell fill="#ef4444" />
          <Cell fill="#e5e7eb" />

        </Pie>

        <Tooltip
          formatter={(value) =>
            `${Number(value).toFixed(2)}%`
          }
        />

        <Legend />

      </PieChart>

    </ResponsiveContainer>


    <div className="risk-chart-center">

      <strong>
        {probability.toFixed(1)}%
      </strong>

      <span>
        Fraud Risk
      </span>

    </div>

  </div>


  <div className="risk-chart-status">

    {probability >= 75 ? (
      <>
        <strong className="danger-text">
          High Risk
        </strong>

        <p>
          The transaction has a high predicted
          probability of fraud.
        </p>
      </>
    ) : probability >= 40 ? (
      <>
        <strong className="warning-text">
          Medium Risk
        </strong>

        <p>
          Additional verification is recommended
          before approving the transaction.
        </p>
      </>
    ) : (
      <>
        <strong className="safe-text">
          Low Risk
        </strong>

        <p>
          The model detected a relatively low
          probability of fraud.
        </p>
      </>
    )}

  </div>

</div>


);
}

export default RiskChart;
