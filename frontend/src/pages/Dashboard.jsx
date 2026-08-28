import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================

  const [transactions, setTransactions] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [timePeriod, setTimePeriod] = useState("This Month");
  const [view, setView] = useState("Daily");

  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =========================
  // GET TRANSACTIONS
  // =========================

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/risk/transactions",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch transactions"
        );
      }

      console.log("TRANSACTIONS FROM BACKEND:", data);

      setTransactions(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Transaction fetch error:",
        error
      );

      setTransactions([]);
    }
  };

  // =========================
  // GET RETURNS
  // =========================

  const fetchReturns = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/returns",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch returns"
        );
      }

      console.log("RETURNS FROM BACKEND:", data);

      setReturns(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Return fetch error:",
        error
      );

      setReturns([]);
    }
  };

  // =========================
  // LOAD DASHBOARD
  // =========================

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      await Promise.all([
        fetchTransactions(),
        fetchReturns(),
      ]);

      setLoading(false);
    };

    loadDashboard();
  }, []);

  // =========================
  // DATE HELPERS
  // =========================

  const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const endOfDay = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();

    const difference =
      day === 0 ? -6 : 1 - day;

    d.setDate(d.getDate() + difference);
    d.setHours(0, 0, 0, 0);

    return d;
  };

  const startOfMonth = (date) => {
    const d = new Date(date);

    return new Date(
      d.getFullYear(),
      d.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
  };

  const endOfMonth = (date) => {
    const d = new Date(date);

    return new Date(
      d.getFullYear(),
      d.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
  };

  const startOfYear = (date) => {
    const d = new Date(date);

    return new Date(
      d.getFullYear(),
      0,
      1,
      0,
      0,
      0,
      0
    );
  };

  const endOfYear = (date) => {
    const d = new Date(date);

    return new Date(
      d.getFullYear(),
      11,
      31,
      23,
      59,
      59,
      999
    );
  };

  // =========================
  // FILTER DATE RANGE
  // =========================

  const selectedDateRange = useMemo(() => {
    const today = new Date();

    let start;
    let end;

    switch (timePeriod) {
      case "Today":
        start = startOfDay(today);
        end = endOfDay(today);
        break;

      case "Yesterday": {
        const yesterday = new Date(today);
        yesterday.setDate(
          yesterday.getDate() - 1
        );

        start = startOfDay(yesterday);
        end = endOfDay(yesterday);
        break;
      }

      case "This Week":
        start = startOfWeek(today);
        end = endOfDay(today);
        break;

      case "This Month":
        start = startOfMonth(today);
        end = endOfDay(today);
        break;

      case "Last Month": {
        const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );

        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      }

      case "This Year":
        start = startOfYear(today);
        end = endOfDay(today);
        break;

      case "Custom Date Range":
        if (
          customStartDate &&
          customEndDate
        ) {
          start = startOfDay(
            new Date(customStartDate)
          );

          end = endOfDay(
            new Date(customEndDate)
          );
        } else {
          start = startOfMonth(today);
          end = endOfDay(today);
        }
        break;

      default:
        start = startOfMonth(today);
        end = endOfDay(today);
    }

    return {
      start,
      end,
    };
  }, [
    timePeriod,
    customStartDate,
    customEndDate,
  ]);

  // =========================
  // FILTER TRANSACTIONS
  // =========================

  const filteredTransactions = useMemo(() => {
    const { start, end } =
      selectedDateRange;

    return transactions.filter(
      (transaction) => {
        if (!transaction.createdAt) {
          return false;
        }

        const date = new Date(
          transaction.createdAt
        );

        return date >= start && date <= end;
      }
    );
  }, [
    transactions,
    selectedDateRange,
  ]);

  // =========================
  // FILTER RETURNS
  // =========================

  const filteredReturns = useMemo(() => {
    const { start, end } =
      selectedDateRange;

    return returns.filter((item) => {
      if (!item.createdAt) {
        return false;
      }

      const date = new Date(
        item.createdAt
      );

      return date >= start && date <= end;
    });
  }, [
    returns,
    selectedDateRange,
  ]);

  // =========================
  // TRANSACTION CALCULATIONS
  // =========================

  const totalTransactions =
    filteredTransactions.length;

  const fraudTransactions =
    filteredTransactions.filter(
      (transaction) =>
        String(
          transaction.prediction || ""
        ).toLowerCase() === "fraud"
    );

  const legitimateTransactions =
    filteredTransactions.filter(
      (transaction) =>
        String(
          transaction.prediction || ""
        ).toLowerCase() ===
        "legitimate"
    );

  const fraudAmount =
    fraudTransactions.reduce(
      (total, transaction) =>
        total +
        Number(
          transaction.transactionAmount || 0
        ),
      0
    );

  const legitimateAmount =
    legitimateTransactions.reduce(
      (total, transaction) =>
        total +
        Number(
          transaction.transactionAmount || 0
        ),
      0
    );

  const totalAmount =
    fraudAmount + legitimateAmount;

  // =========================
  // RETURN CALCULATIONS
  // =========================

  const totalReturns =
    filteredReturns.length;

  // IMPORTANT:
  // Handles High / high / HIGH
  const highRiskReturns =
    filteredReturns.filter((item) => {
      const level = String(
        item.riskLevel || ""
      )
        .trim()
        .toLowerCase();

      return level === "high";
    });

  const returnAmount =
    filteredReturns.reduce(
      (total, item) =>
        total +
        Number(
          item.orderAmount || 0
        ),
      0
    );

  // VALUE OF ONLY HIGH-RISK RETURNS
  const highRiskReturnAmount =
    highRiskReturns.reduce(
      (total, item) =>
        total +
        Number(
          item.orderAmount || 0
        ),
      0
    );

  // =========================
  // FORMAT MONEY
  // =========================

  const formatAmount = (amount) => {
    return new Intl.NumberFormat(
      "en-IN"
    ).format(Number(amount) || 0);
  };

  // =========================
  // PIE CHART
  // =========================

  const chartData = [
    {
      name: "Legitimate",
      value:
        legitimateTransactions.length,
    },
    {
      name: "Fraud",
      value:
        fraudTransactions.length,
    },
  ];

  // =========================
  // GROUP DATA FOR CHARTS
  // =========================

  const getGroupKey = (date) => {
    if (view === "Daily") {
      return date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
        }
      );
    }

    if (view === "Weekly") {
      const weekStart =
        startOfWeek(date);

      return `Week of ${weekStart.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
        }
      )}`;
    }

    if (view === "Monthly") {
      return date.toLocaleDateString(
        "en-IN",
        {
          month: "short",
          year: "numeric",
        }
      );
    }

    if (view === "Yearly") {
      return String(
        date.getFullYear()
      );
    }

    return date.toLocaleDateString(
      "en-IN"
    );
  };

  // =========================
  // TRANSACTION TREND
  // =========================

  const transactionTrendData =
    useMemo(() => {
      const grouped = {};

      filteredTransactions.forEach(
        (transaction) => {
          if (!transaction.createdAt) {
            return;
          }

          const date = new Date(
            transaction.createdAt
          );

          const key =
            getGroupKey(date);

          if (!grouped[key]) {
            grouped[key] = {
              period: key,
              total: 0,
              fraud: 0,
              legitimate: 0,
              transactionValue: 0,
            };
          }

          grouped[key].total += 1;

          grouped[key].transactionValue +=
            Number(
              transaction.transactionAmount ||
                0
            );

          const prediction =
            String(
              transaction.prediction || ""
            ).toLowerCase();

          if (
            prediction === "fraud"
          ) {
            grouped[key].fraud += 1;
          } else if (
            prediction ===
            "legitimate"
          ) {
            grouped[key].legitimate +=
              1;
          }
        }
      );

      return Object.values(grouped);
    }, [
      filteredTransactions,
      view,
    ]);

  // =========================
  // RETURN TREND
  // =========================

  const returnTrendData =
    useMemo(() => {
      const grouped = {};

      filteredReturns.forEach(
        (item) => {
          if (!item.createdAt) {
            return;
          }

          const date = new Date(
            item.createdAt
          );

          const key =
            getGroupKey(date);

          if (!grouped[key]) {
            grouped[key] = {
              period: key,
              returns: 0,
              highRiskReturns: 0,
              returnValue: 0,
              highRiskValue: 0,
            };
          }

          grouped[key].returns += 1;

          grouped[key].returnValue +=
            Number(
              item.orderAmount || 0
            );

          const level = String(
            item.riskLevel || ""
          )
            .trim()
            .toLowerCase();

          if (level === "high") {
            grouped[key]
              .highRiskReturns += 1;

            grouped[key].highRiskValue +=
              Number(
                item.orderAmount || 0
              );
          }
        }
      );

      return Object.values(grouped);
    }, [
      filteredReturns,
      view,
    ]);

  // =========================
  // SUSPICIOUS USERS
  // =========================

  const suspiciousUsers =
    useMemo(() => {
      return fraudTransactions
        .reduce(
          (users, transaction) => {
            const userId =
              transaction.userId ||
              "Unknown User";

            const existingUser =
              users.find(
                (user) =>
                  user.userId ===
                  userId
              );

            if (existingUser) {
              existingUser.transactions +=
                1;

              existingUser.amount +=
                Number(
                  transaction.transactionAmount ||
                    0
                );
            } else {
              users.push({
                userId,
                transactions: 1,
                amount: Number(
                  transaction.transactionAmount ||
                    0
                ),
              });
            }

            return users;
          },
          []
        )
        .sort(
          (a, b) =>
            b.transactions -
            a.transactions
        )
        .slice(0, 5);
    }, [
      fraudTransactions,
    ]);

  // =========================
  // PAGE
  // =========================

  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="dashboard-header">

        <button
          className="home-button"
          onClick={() =>
            navigate("/")
          }
        >
          ← Home
        </button>

        <div>
          <h1>Risk Overview</h1>

          <p>
            Monitor your business
            transactions and risk.
          </p>
        </div>

        <button
          className="new-transaction-button"
          onClick={() =>
            navigate(
              "/check-transaction"
            )
          }
        >
          + New Transaction
        </button>

        <button
          className="new-transaction-button"
          onClick={() =>
            navigate(
              "/check-return"
            )
          }
        >
          + Check Return
        </button>

        <div className="dashboard-status">
          ● System Active
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* =========================
          ANALYTICS FILTERS
      ========================= */}

      <div className="dashboard-section analytics-filters">

        <div className="section-header">
          <div>
            <h2>
              📅 Analytics Filters
            </h2>

            <p>
              Analyze transaction and
              return activity by time.
            </p>
          </div>
        </div>

        <div className="filter-grid">

          <div className="filter-group">

            <label>
              Time Period
            </label>

            <select
              value={timePeriod}
              onChange={(e) =>
                setTimePeriod(
                  e.target.value
                )
              }
            >
              <option>
                Today
              </option>

              <option>
                Yesterday
              </option>

              <option>
                This Week
              </option>

              <option>
                This Month
              </option>

              <option>
                Last Month
              </option>

              <option>
                This Year
              </option>

              <option>
                Custom Date Range
              </option>
            </select>

          </div>

          <div className="filter-group">

            <label>
              View
            </label>

            <select
              value={view}
              onChange={(e) =>
                setView(
                  e.target.value
                )
              }
            >
              <option>
                Daily
              </option>

              <option>
                Weekly
              </option>

              <option>
                Monthly
              </option>

              <option>
                Yearly
              </option>
            </select>

          </div>

          {timePeriod ===
            "Custom Date Range" && (
            <>
              <div className="filter-group">

                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  value={
                    customStartDate
                  }
                  onChange={(e) =>
                    setCustomStartDate(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="filter-group">

                <label>
                  End Date
                </label>

                <input
                  type="date"
                  value={
                    customEndDate
                  }
                  onChange={(e) =>
                    setCustomEndDate(
                      e.target.value
                    )
                  }
                />

              </div>
            </>
          )}

        </div>

      </div>

      {/* =========================
          SELECTED PERIOD SUMMARY
      ========================= */}

      <div className="summary-cards">

        <div className="summary-card">
          <span>
            Total Transactions
          </span>

          <strong>
            {loading
              ? "..."
              : totalTransactions}
          </strong>
        </div>

        <div className="summary-card fraud-card">
          <span>
            Fraud Detected
          </span>

          <strong>
            {loading
              ? "..."
              : fraudTransactions.length}
          </strong>
        </div>

        <div className="summary-card">
          <span>
            Legitimate
          </span>

          <strong>
            {loading
              ? "..."
              : legitimateTransactions.length}
          </strong>
        </div>

        <div className="summary-card money-card">
          <span>
            Money At Risk
          </span>

          <strong>
            {loading
              ? "..."
              : `₹${formatAmount(
                  fraudAmount
                )}`}
          </strong>
        </div>

      </div>

      {/* =========================
          PERIOD DETAILS
      ========================= */}

      <div className="dashboard-section">

        <div className="section-header">
          <div>

            <h2>
              {timePeriod ===
              "This Month"
                ? new Date().toLocaleDateString(
                    "en-IN",
                    {
                      month:
                        "long",
                      year:
                        "numeric",
                    }
                  )
                : timePeriod}
            </h2>

            <p>
              {view} analytics
              for the selected
              period.
            </p>

          </div>
        </div>

        <div className="value-grid">

          <div className="value-item">
            <span>
              Transactions
            </span>

            <strong>
              {totalTransactions}
            </strong>
          </div>

          <div className="value-item fraud-value">
            <span>
              Fraud Transactions
            </span>

            <strong>
              {
                fraudTransactions.length
              }
            </strong>
          </div>

          <div className="value-item legitimate-value">
            <span>
              Legitimate Transactions
            </span>

            <strong>
              {
                legitimateTransactions.length
              }
            </strong>
          </div>

          <div className="value-item">
            <span>
              Transaction Value
            </span>

            <strong>
              ₹
              {formatAmount(
                totalAmount
              )}
            </strong>
          </div>

        </div>

      </div>

      {/* =========================
          RECENT TRANSACTIONS
      ========================= */}

      <div className="dashboard-section">

        <div className="section-header">
          <div>

            <h2>
              Recent Transactions
            </h2>

            <p>
              Latest transactions
              analyzed by AI.
            </p>

          </div>
        </div>

        <div className="transaction-list">

          {loading ? (
            <div className="no-transactions">
              Loading transactions...
            </div>
          ) : filteredTransactions.length ===
            0 ? (
            <div className="no-transactions">
              No transactions found
              for this period.
            </div>
          ) : (
            filteredTransactions
              .slice()
              .reverse()
              .slice(0, 10)
              .map(
                (transaction) => {

                  const isFraud =
                    String(
                      transaction.prediction ||
                        ""
                    ).toLowerCase() ===
                    "fraud";

                  return (
                    <div
                      className="transaction-row"
                      key={
                        transaction._id
                      }
                    >

                      <div>
                        <strong>
                          #
                          {transaction._id
                            ?.slice(-6)
                            .toUpperCase()}
                        </strong>

                        <span>
                          {transaction.createdAt
                            ? new Date(
                                transaction.createdAt
                              ).toLocaleString()
                            : "Unknown date"}
                        </span>
                      </div>

                      <strong>
                        ₹
                        {formatAmount(
                          transaction.transactionAmount
                        )}
                      </strong>

                      <span
                        className={`risk ${
                          isFraud
                            ? "high"
                            : "low"
                        }`}
                      >
                        {isFraud
                          ? transaction.riskLevel ||
                            "High Risk"
                          : "Legitimate"}
                      </span>

                    </div>
                  );
                }
              )
          )}

        </div>

      </div>

      {/* =========================
          TRANSACTION OVERVIEW
      ========================= */}

      <div className="dashboard-section analytics-card">

        <div className="section-header">
          <div>

            <h2>
              Fraud vs Legitimate
            </h2>

            <p>
              Transaction composition
              for the selected period.
            </p>

          </div>
        </div>

        {totalTransactions === 0 ? (
          <div className="no-transactions">
            No transaction data
            available.
          </div>
        ) : (
          <div className="chart-wrapper">

            <ResponsiveContainer
              width="100%"
              height={280}
            >

              <PieChart>

                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >

                  {chartData.map(
                    (
                      entry,
                      index
                    ) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name ===
                          "Fraud"
                            ? "#ef4444"
                            : "#22c55e"
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>
        )}

      </div>

      {/* =========================
          TRANSACTION TREND
      ========================= */}

      <div className="dashboard-section trend-card">

        <div className="section-header">
          <div>

            <h2>
              Transaction Trend
            </h2>

            <p>
              Transactions, fraud and
              legitimate activity by{" "}
              {view.toLowerCase()}.
            </p>

          </div>
        </div>

        {transactionTrendData.length ===
        0 ? (
          <div className="no-transactions">
            No transaction trend
            data available.
          </div>
        ) : (
          <div className="trend-chart">

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <LineChart
                data={
                  transactionTrendData
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="period"
                />

                <YAxis
                  allowDecimals={false}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="total"
                  name="Transactions"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="fraud"
                  name="Fraud"
                  stroke="#ef4444"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="legitimate"
                  name="Legitimate"
                  stroke="#22c55e"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>
        )}

      </div>

      {/* =========================
          TRANSACTION VALUE
      ========================= */}

      <div className="dashboard-section value-card">

        <div className="section-header">
          <div>

            <h2>
              Transaction Value
            </h2>

            <p>
              Money processed across
              analyzed transactions.
            </p>

          </div>
        </div>

        <div className="value-grid">

          <div className="value-item">
            <span>
              Total Value
            </span>

            <strong>
              ₹
              {formatAmount(
                totalAmount
              )}
            </strong>
          </div>

          <div className="value-item fraud-value">
            <span>
              Fraud Value
            </span>

            <strong>
              ₹
              {formatAmount(
                fraudAmount
              )}
            </strong>
          </div>

          <div className="value-item legitimate-value">
            <span>
              Legitimate Value
            </span>

            <strong>
              ₹
              {formatAmount(
                legitimateAmount
              )}
            </strong>
          </div>

        </div>

      </div>

      {/* =========================
          SUSPICIOUS USERS
      ========================= */}

      <div className="dashboard-section suspicious-card">

        <div className="section-header">
          <div>

            <h2>
              Suspicious Users
            </h2>

            <p>
              Users associated with
              suspicious transactions
              in the selected period.
            </p>

          </div>
        </div>

        {suspiciousUsers.length ===
        0 ? (
          <div className="no-transactions">
            No suspicious users
            detected.
          </div>
        ) : (
          <div className="suspicious-list">

            {suspiciousUsers.map(
              (user) => (
                <div
                  className="suspicious-row"
                  key={user.userId}
                >

                  <div>
                    <strong>
                      {user.userId}
                    </strong>

                    <span>
                      {user.transactions}{" "}
                      suspicious
                      transaction
                      {user.transactions >
                      1
                        ? "s"
                        : ""}
                    </span>
                  </div>

                  <div className="suspicious-amount">

                    <strong>
                      ₹
                      {formatAmount(
                        user.amount
                      )}
                    </strong>

                    <span>
                      High Risk
                    </span>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* =========================
          RETURN RISK
      ========================= */}

      <div className="dashboard-section return-card">

        <div className="section-header">
          <div>

            <h2>
              Return Risk
            </h2>

            <p>
              Monitor return activity
              and potential exposure
              for the selected period.
            </p>

          </div>
        </div>

        <div className="value-grid">

          {/* TOTAL RETURNS */}

          <div className="value-item">

            <span>
              Total Returns
            </span>

            <strong>
              {loading
                ? "..."
                : totalReturns}
            </strong>

          </div>

          {/* HIGH RISK RETURN COUNT */}

          <div className="value-item fraud-value">

            <span>
              High-Risk Returns
            </span>

            <strong>
              {loading
                ? "..."
                : highRiskReturns.length}
            </strong>

          </div>

          {/* ALL RETURN VALUE */}

          <div className="value-item">

            <span>
              Return Value
            </span>

            <strong>
              ₹
              {formatAmount(
                returnAmount
              )}
            </strong>

          </div>

          {/* HIGH RISK RETURN VALUE */}

          <div className="value-item fraud-value">

            <span>
              High-Risk Return Value
            </span>

            <strong>
              ₹
              {formatAmount(
                highRiskReturnAmount
              )}
            </strong>

          </div>

        </div>

      </div>

      {/* =========================
          RETURN TREND
      ========================= */}

      <div className="dashboard-section trend-card">

        <div className="section-header">
          <div>

            <h2>
              Return Trend
            </h2>

            <p>
              Returns and high-risk
              returns by{" "}
              {view.toLowerCase()}.
            </p>

          </div>
        </div>

        {returnTrendData.length ===
        0 ? (
          <div className="no-transactions">
            No return data available
            for this period.
          </div>
        ) : (
          <div className="trend-chart">

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <LineChart
                data={
                  returnTrendData
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="period"
                />

                <YAxis
                  allowDecimals={false}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="returns"
                  name="Returns"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="highRiskReturns"
                  name="High-Risk Returns"
                  stroke="#ef4444"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>
        )}

      </div>

      {/* =========================
          RETURN VALUE TREND
      ========================= */}

      <div className="dashboard-section value-card">

        <div className="section-header">
          <div>

            <h2>
              Return Value Trend
            </h2>

            <p>
              Return value and
              high-risk return value
              across the selected
              period.
            </p>

          </div>
        </div>

        {returnTrendData.length ===
        0 ? (
          <div className="no-transactions">
            No return value data
            available.
          </div>
        ) : (
          <div className="trend-chart">

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={
                  returnTrendData
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="period"
                />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="returnValue"
                  name="Return Value"
                  fill="#3b82f6"
                />

                <Bar
                  dataKey="highRiskValue"
                  name="High-Risk Return Value"
                  fill="#ef4444"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;