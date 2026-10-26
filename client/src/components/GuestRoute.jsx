
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

function GuestRoute() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const checkAuthentication = async () => {
      try {
        await axios.get(
          "http://localhost:5000/api/auth/profile",
          { withCredentials: true }
        );

        if (!cancelled) {
          setAuthenticated(true);
        }
      } catch (error) {
        if (!cancelled) {
          if (error.response?.status === 401) {
            setAuthenticated(false);
          } else {
            setError(
              "Unable to verify your login. Please check your connection and try again."
            );
          }
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    };

    checkAuthentication();

    return () => {
      cancelled = true;
    };
  }, []);

  if (checking) {
    return <p>Checking authentication...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
