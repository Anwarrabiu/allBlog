
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    let cancelled = false;

    const checkLogin = async () => {
      setChecking(true);

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
              "Navbar authentication check failed:",
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
  }, [location.pathname]);

  useEffect(() => {
    const handleAuthChange = (event) => {
      setUser(event.detail?.user || null);
      setChecking(false);
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      setUser(null);
      closeMenu();

      window.dispatchEvent(
        new CustomEvent("auth-change", {
          detail: { user: null },
        })
      );

      navigate("/login", { replace: true });
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data || error.message
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname === path;
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/" className="brand" onClick={closeMenu}>
        <span className="brand-icon" aria-hidden="true">
          AB

        </span>

        <span className="brand-text">
          <span className="brand-name">ALLBLOG</span>
          <span className="brand-tagline">Ideas worth sharing</span>
        </span>
      </Link>

      <button
        type="button"
        className="menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={
          menuOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={menuOpen}
        aria-controls="navbar-links"
      >
        {menuOpen ? (
          <span aria-hidden="true">✕</span>
        ) : (
          <span aria-hidden="true">☰</span>
        )}
      </button>

      {menuOpen && (
        <button
          type="button"
          className="drawer-overlay"
          onClick={closeMenu}
          aria-label="Close navigation menu"
          tabIndex={-1}
        />
      )}

      <div
        id="navbar-links"
        className={`navbar-links ${menuOpen ? "drawer-open" : ""}`}
        aria-busy={checking}
      >
        <Link
          to="/"
          className={`nav-link ${isActive("/") ? "active" : ""}`}
          aria-current={isActive("/") ? "page" : undefined}
          onClick={closeMenu}
        >
          Home
        </Link>

        {checking ? (
          <span className="nav-loading" role="status">
            Checking account...
          </span>
        ) : user ? (
          <>
            <Link
              to="/profile"
              className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              aria-current={isActive("/profile") ? "page" : undefined}
              onClick={closeMenu}
            >
              Profile
            </Link>

            <Link
              to="/my-posts"
              className={`nav-link ${isActive("/my-posts") ? "active" : ""}`}
              aria-current={isActive("/my-posts") ? "page" : undefined}
              onClick={closeMenu}
            >
              My Posts
            </Link>

            <Link
              to="/create-post"
              className="nav-create-post"
              onClick={closeMenu}
            >
              <span aria-hidden="true">+</span> Create Post
            </Link>

            <button
              type="button"
              className="nav-logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`nav-link ${isActive("/login") ? "active" : ""}`}
              aria-current={isActive("/login") ? "page" : undefined}
              onClick={closeMenu}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="nav-register"
              onClick={closeMenu}
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
