
import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import axios from "axios";

function ProtectedRoute() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

 // We added useLocation() to remember the page the user originally wanted to visit.
  const location = useLocation();

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

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}  //We added useLocation() to remember the page the user originally wanted to visit.
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
