
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function PostDetails() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchPost = async () => {
      setLoading(true);
      setError("");
      setPost(null);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/${id}`
        );

        if (!cancelled) {
          setPost(response.data.post || null);
        }
      } catch (error) {
        console.error("Error fetching post:", error);

        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              "Unable to load this article. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "Recently published";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently published";
    }

    return parsedDate.toLocaleDateString("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="article-page">
        <div className="article-status" role="status">
          <span className="loading-spinner"></span>
          <p>Loading article...</p>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="article-page">
        <div className="article-error">
          <h1>Article unavailable</h1>
          <p>{error || "This article could not be found."}</p>
          <Link to="/" className="back-link">
            <span aria-hidden="true">←</span> Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="article-page">
      <div className="article-navigation">
        <Link to="/" className="back-link">
          <span aria-hidden="true">←</span> Back to Home
        </Link>
      </div>

      <article className="article">
        <header className="article-header">
          <span className="article-category">
            {post.category || "General"}
          </span>

          <h1>{post.title}</h1>

          <p className="article-intro">
            Ideas, experiences, and knowledge worth sharing.
          </p>

          <div className="article-meta">
            <div className="article-author">
              <span className="article-avatar" aria-hidden="true">
                {post.author?.username?.charAt(0).toUpperCase() || "U"}
              </span>

              <div>
                <span className="article-author-name">
                  {post.author?.username || "Unknown author"}
                </span>
                <span className="article-author-label">
                  Article author
                </span>
              </div>
            </div>

            <div className="article-date">
              <span>Published</span>
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </div>
          </div>
        </header>

        <div className="article-divider"></div>

        <div className="full-content">
          {post.content}
        </div>

        <footer className="article-footer">
          <p>Thank you for reading.</p>
          <Link to="/" className="article-home-link">
            Discover more articles <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </article>
    </main>
  );
}

export default PostDetails;
