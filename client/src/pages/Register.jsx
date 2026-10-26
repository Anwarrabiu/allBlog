
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (trimmedUsername.length < 3) {
      setMessage("Username must contain at least 3 characters.");
      return;
    }

    if (trimmedUsername.length > 30) {
      setMessage("Username cannot exceed 30 characters.");
      return;
    }

    if (!trimmedEmail) {
      setMessage("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: trimmedUsername,
          email: trimmedEmail,
          password,
        }
      );

      setPassword("");

      navigate("/login", {
        replace: true,
        state: {
          successMessage:
            response.data.message ||
            "Account created successfully. Please log in.",
        },
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand-mark" aria-hidden="true">
          M
        </div>

        <div className="auth-heading">
          <span className="auth-eyebrow">JOIN OUR COMMUNITY</span>
          <h1>Create your account</h1>
          <p>
            Join our community to publish articles, share your knowledge,
            and connect with readers.
          </p>
        </div>

        {message && (
          <div className="auth-message error" role="alert">
            {message}
          </div>
        )}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-field">
            <label htmlFor="register-username">Username</label>
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Choose a username"
              autoComplete="username"
              minLength={3}
              maxLength={30}
              required
              disabled={submitting}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
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
            <label htmlFor="register-password">Password</label>

            <div className="auth-password-wrapper">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
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

            <span className="auth-field-hint">
              Use at least 8 characters.
            </span>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            Already have an account?{" "}
            <Link to="/login">Login here</Link>
          </p>
        </div>

        <div className="auth-footer">
          <Link to="/">← Back to Home</Link>
        </div>
      </section>
    </main>
  );
}

export default Register;
