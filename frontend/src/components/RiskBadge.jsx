import "./RiskBadge.css";

function RiskBadge({ risk }) {
const normalizedRisk = String(risk || "Unknown").toLowerCase();

let className = "risk-badge unknown";

if (normalizedRisk === "low") {
className = "risk-badge low";
} else if (normalizedRisk === "medium") {
className = "risk-badge medium";
} else if (
normalizedRisk === "high" ||
normalizedRisk === "critical"
) {
className = "risk-badge high";
}

return ( <span className={className}>
{risk || "Unknown"} </span>
);
}

export default RiskBadge;
