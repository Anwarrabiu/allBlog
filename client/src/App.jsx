
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/posts"
        );

        if (!cancelled) {
          setPosts(
            Array.isArray(response.data.posts)
              ? response.data.posts
              : []
          );
        }
      } catch (error) {
        console.error("Error fetching posts:", error);

        if (!cancelled) {
          setError("Unable to load blog posts. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (date) => {
    if (!date) return "Recently published";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently published";
    }

    return parsedDate.toLocaleDateString("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="app">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">
            IDEAS WORTH SHARING
          </span>

          <h1>
            Discover stories.
            <br />
            <span>Expand your thinking.</span>
          </h1>

          <p>
            A place for ideas, experiences, and knowledge.
            Explore articles, learn something new, and discover
            perspectives that matter.
          </p>

          <a href="#latest-posts" className="hero-button">
            Explore articles <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="hero-decoration" aria-hidden="true">
          <div className="decoration-circle circle-one"></div>
          <div className="decoration-circle circle-two"></div>
          <div className="decoration-line"></div>
          <span className="decoration-mark">M</span>
        </div>
      </section>

      <main className="container" id="latest-posts">
        <div className="section-heading">
          <div>
            <span className="section-label">THE BLOG</span>
            <h2>Latest articles</h2>
            <p>
              Fresh ideas and useful insights, all in one place.
            </p>
          </div>

          {!loading && !error && posts.length > 0 && (
            <span className="post-count">
              {posts.length}{" "}
              {posts.length === 1 ? "article" : "articles"}
            </span>
          )}
        </div>

        {loading && (
          <div className="status-message" role="status">
            <span className="loading-spinner"></span>
            <p>Loading articles...</p>
          </div>
        )}

        {error && (
          <div className="status-message error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">
              ✎
            </span>
            <h3>No articles yet</h3>
            <p>
              There are no published articles at the moment.
              Check back soon for something new to read.
            </p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="posts">
            {posts.map((post) => (
              <article className="post-card" key={post._id}>
                <div className="post-card-top">
                  <span className="category">
                    {post.category || "General"}
                  </span>

                  <span className="post-date">
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                <h3>
                  <Link
                    to={`/posts/${post._id}`}
                    className="post-title-link"
                  >
                    {post.title}
                  </Link>
                </h3>

                <p className="content">
                  {post.content?.length > 180
                    ? `${post.content.substring(0, 180).trim()}...`
                    : post.content}
                </p>

                <div className="post-card-footer">
                  <div className="author-info">
                    <span className="author-avatar" aria-hidden="true">
                      {post.author?.username
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </span>

                    <div className="author-details">
                      <span className="author-name">
                        {post.author?.username || "Unknown author"}
                      </span>
                      <span className="author-label">
                        Article author
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/posts/${post._id}`}
                    className="read-more"
                    aria-label={`Read more: ${post.title}`}
                  >
                    Read article <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="home-footer">
          <p>Ideas are better when they are shared.</p>
          <span>MERN Blog</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
