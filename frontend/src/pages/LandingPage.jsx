import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  const userName = user?.name || "User";

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);

    navigate("/");
  };

  return (
    <div className="landing-page">

      {/* ================= NAVBAR ================= */}

      <nav className="landing-navbar">

        <div className="landing-logo">
          🛡️ <span>AI Risk Manager</span>
        </div>

        <div className="landing-nav-links">

          <a href="#solutions">
            Solutions
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#analytics">
            Analytics
          </a>

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="login-link"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="nav-button"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="login-link"
              >
                Dashboard
              </Link>

              <button
                type="button"
                className="nav-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            🛡️ AI-Powered Merchant Risk Protection
          </div>

          {isLoggedIn ? (
            <>
              <h1>
                Welcome back,
                <span> {userName} 👋</span>
              </h1>

              <p>
                Monitor your transactions, detect fraud,
                identify suspicious users and manage
                return risk from one intelligent platform.
              </p>

              <div className="hero-buttons">

                <Link
                  to="/dashboard"
                  className="primary-button"
                >
                  Open Dashboard →
                </Link>

                <Link
                  to="/check-transaction"
                  className="secondary-button"
                >
                  + New Transaction
                </Link>

                <Link
                  to="/check-return"
                  className="secondary-button"
                >
                  Check Return
                </Link>

              </div>
            </>
          ) : (
            <>
              <h1>
                Stop fraud before it
                <span> costs your business.</span>
              </h1>

              <p>
                Detect fraudulent transactions, identify
                suspicious users, predict return risk and
                manage chargebacks with intelligent risk
                analysis.
              </p>

              <div className="hero-buttons">

                <Link
                  to="/signup"
                  className="primary-button"
                >
                  Get Started →
                </Link>

                <a
                  href="#how-it-works"
                  className="secondary-button"
                >
                  See How It Works
                </a>

              </div>
            </>
          )}

        </div>


        {/* ================= HERO DASHBOARD PREVIEW ================= */}

        <div className="hero-dashboard">

          <div className="preview-header">

            <span>
              Risk Overview
            </span>

            <span className="live-status">
              ● Live
            </span>

          </div>


          <div className="preview-stats">

            <div>
              <small>
                Transactions
              </small>

              <strong>
                12,450
              </strong>
            </div>


            <div>
              <small>
                Fraud Detected
              </small>

              <strong className="danger">
                482
              </strong>
            </div>


            <div>
              <small>
                Money at Risk
              </small>

              <strong>
                ₹18.4L
              </strong>
            </div>

          </div>


          <div className="risk-preview">

            <div className="risk-preview-title">
              Fraud Activity
            </div>

            <div className="fake-chart">

              <div className="chart-line line-one"></div>

              <div className="chart-line line-two"></div>

              <div className="chart-line line-three"></div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= PROBLEM AREAS ================= */}

      <section
        className="solutions"
        id="solutions"
      >

        <div className="section-heading">

          <span>
            PROTECT YOUR BUSINESS
          </span>

          <h2>
            One platform for
            <strong> every risk.</strong>
          </h2>

          <p>
            Identify where your business is losing money
            and take action before the damage grows.
          </p>

        </div>


        <div className="solution-grid">

          <div className="solution-card">

            <div className="solution-icon">
              🔴
            </div>

            <h3>
              Fraud Detection
            </h3>

            <p>
              Detect suspicious transactions using
              machine learning and risk signals.
            </p>

          </div>


          <div className="solution-card">

            <div className="solution-icon">
              🔄
            </div>

            <h3>
              Return Risk
            </h3>

            <p>
              Identify unusual return behaviour and
              estimate potential financial exposure.
            </p>

          </div>


          <div className="solution-card">

            <div className="solution-icon">
              💳
            </div>

            <h3>
              Chargebacks
            </h3>

            <p>
              Monitor disputes and organize evidence
              to reduce avoidable losses.
            </p>

          </div>


          <div className="solution-card">

            <div className="solution-icon">
              👥
            </div>

            <h3>
              Suspicious Users
            </h3>

            <p>
              Find unusual user behaviour and
              potentially coordinated activity.
            </p>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section
        className="how-it-works"
        id="how-it-works"
      >

        <div className="section-heading">

          <span>
            HOW IT WORKS
          </span>

          <h2>
            From risk detection
            <strong> to action.</strong>
          </h2>

        </div>


        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <h3>
              Detect
            </h3>

            <p>
              AI analyzes transactions and
              identifies suspicious behaviour.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <h3>
              Investigate
            </h3>

            <p>
              Understand why a transaction or
              user was flagged.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <h3>
              Act
            </h3>

            <p>
              Receive recommended defensive
              actions based on risk.
            </p>

          </div>


          <div className="step">

            <div className="step-number">
              04
            </div>

            <h3>
              Protect
            </h3>

            <p>
              Track losses prevented and measure
              the impact over time.
            </p>

          </div>

        </div>

      </section>


      {/* ================= ANALYTICS ================= */}

      <section
        className="analytics-section"
        id="analytics"
      >

        <div className="analytics-content">

          <span>
            INTELLIGENT ANALYTICS
          </span>

          <h2>
            Know where your
            <strong> money is at risk.</strong>
          </h2>

          <p>
            Turn complex transaction data into
            simple visual insights that help
            merchants make better decisions.
          </p>

          <div className="analytics-list">

            <div>
              ✓ Fraud vs legitimate transactions
            </div>

            <div>
              ✓ Suspicious users and behaviour
            </div>

            <div>
              ✓ Weekly and monthly risk trends
            </div>

            <div>
              ✓ Money lost and money protected
            </div>

          </div>

        </div>


        <div className="analytics-card">

          <div className="analytics-card-header">

            <span>
              Transaction Overview
            </span>

            <span>
              Monthly
            </span>

          </div>


          <div className="analytics-numbers">

            <div>
              <small>
                Total
              </small>

              <strong>
                48,920
              </strong>
            </div>


            <div>
              <small>
                Legitimate
              </small>

              <strong className="safe">
                46,210
              </strong>
            </div>


            <div>
              <small>
                Fraud
              </small>

              <strong className="danger">
                2,710
              </strong>
            </div>

          </div>


          <div className="bar-chart">

            <div style={{ height: "45%" }}></div>

            <div style={{ height: "65%" }}></div>

            <div style={{ height: "50%" }}></div>

            <div style={{ height: "80%" }}></div>

            <div style={{ height: "70%" }}></div>

            <div style={{ height: "90%" }}></div>

            <div style={{ height: "75%" }}></div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      {!isLoggedIn && (
        <section className="final-cta">

          <h2>
            Don't wait for fraud
            to become a loss.
          </h2>

          <p>
            Start monitoring your transaction risk
            with AI Risk Manager.
          </p>

          <Link
            to="/signup"
            className="primary-button"
          >
            Protect Your Business →
          </Link>

        </section>
      )}


      {/* ================= FOOTER ================= */}

      <footer>

        <div>
          🛡️ AI Risk Manager
        </div>

        <p>
          Intelligent merchant risk protection.
        </p>

      </footer>

    </div>
  );
}

export default LandingPage;
