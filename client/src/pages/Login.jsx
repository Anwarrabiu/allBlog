
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const successMessage = location.state?.successMessage || "";
  const from = location.state?.from;

  const redirectTo =
    from?.pathname?.startsWith("/") &&
    !from.pathname.startsWith("//")
      ? `${from.pathname}${from.search || ""}${from.hash || ""}`
      : "/";

  useEffect(() => {
    let cancelled = false;

    const checkLogin = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          { withCredentials: true }
        );

        if (!cancelled) {
          setUser(response.data.user || null);
        }
      } catch (error) {
        if (!cancelled) {
          setUser(null);

          if (error.response?.status !== 401) {
            console.error(
              "Login status check failed:",
              error.response?.data || error.message
            );
          }
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    };

    checkLogin();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }

    if (!password) {
      setMessage("Please enter your password.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: trimmedEmail,
          password,
        },
        { withCredentials: true }
      );

      const loggedInUser = response.data.user;

      setUser(loggedInUser);
      setPassword("");

      window.dispatchEvent(
        new CustomEvent("auth-change", {
          detail: { user: loggedInUser },
        })
      );

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <main className="auth-page">
        <div className="auth-loading" role="status">
          <span className="loading-spinner"></span>
          <p>Checking your login status...</p>
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="auth-page">
        <section className="auth-card auth-welcome">
          <div className="auth-brand-mark" aria-hidden="true">
            M
          </div>
          <h1>Welcome back, {user.username || "user"}!</h1>
          <p>You are already logged in to your account.</p>
          <button
            type="button"
            className="auth-submit"
            onClick={() => navigate("/", { replace: true })}
          >
            Go to Home
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand-mark" aria-hidden="true">
          AB
        </div>

        <div className="auth-heading">
          <span className="auth-eyebrow">WELCOME BACK</span>
          <h1>Login to your account</h1>
          <p>
            Sign in to manage your articles and continue sharing your ideas.
          </p>
        </div>

        {successMessage && (
          <div className="auth-message success" role="status">
            {successMessage}
          </div>
        )}

        {message && (
          <div className="auth-message error" role="alert">
            {message}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={254}
              required
              disabled={submitting}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>

            <div className="auth-password-wrapper">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={submitting}
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                disabled={submitting}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </div>

        <div className="auth-footer">
          <Link to="/">← Back to Home</Link>
        </div>
      </section>
    </main>
  );
}

export default Login;
