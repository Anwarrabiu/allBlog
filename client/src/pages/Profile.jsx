
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const [profileResponse, postsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/profile", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/posts/my-posts", {
            withCredentials: true,
          }),
        ]);

        if (!cancelled) {
          setUser(profileResponse.data.user);
          setPostCount(postsResponse.data.count ?? postsResponse.data.posts?.length ?? 0);
        }
      } catch (error) {
        if (!cancelled) {
          if (error.response?.status === 401) {
            setUnauthorized(true);
          } else {
            setError(
              error.response?.data?.message ||
                "Unable to load your profile. Please try again."
            );
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="profile-container">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (unauthorized) {
    return <Navigate to="/login" replace />;
  }

  if (error || !user) {
    return (
      <main className="profile-container">
        <p role="alert">
          {error || "User profile not found."}
        </p>
        <Link to="/">Back to Home</Link>
      </main>
    );
  }

  return (
    <main className="profile-container">
      <section className="profile-card">
        <div className="profile-avatar" aria-hidden="true">
          {user.username?.charAt(0).toUpperCase() || "U"}
        </div>

        <h1>My Profile</h1>

        <p className="profile-subtitle">
          Manage and view your account information.
        </p>

        <div className="profile-details">
          <div className="profile-field">
            <span>Username</span>
            <strong>{user.username}</strong>
          </div>

          <div className="profile-field">
            <span>Email Address</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-field">
            <span>Account Role</span>
            <strong>{user.role}</strong>
          </div>

          <div className="profile-field">
            <span>Total Posts</span>
            <strong>{postCount}</strong>
          </div>

          <div className="profile-field">
            <span>Member Since</span>
            <strong>
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Unavailable"}
            </strong>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/my-posts">View My Posts</Link>
          <Link to="/create-post">Create a Post</Link>
        </div>
      </section>
    </main>
  );
}

export default Profile;
