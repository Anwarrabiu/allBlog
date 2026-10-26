
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./MyPosts.css";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "General",
    content: "",
  });
  const [saving, setSaving] = useState(false);
  const [publishingPostId, setPublishingPostId] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchMyPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/posts/my-posts",
          { withCredentials: true }
        );

        if (!cancelled) {
          setPosts(
            Array.isArray(response.data.posts)
              ? response.data.posts
              : []
          );
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              "Unable to load your posts. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMyPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  const publishedCount = posts.filter(
    (post) => post.isPublished
  ).length;

  const draftCount = posts.length - publishedCount;

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handlePublish = async (postId) => {
    setError("");
    setPublishingPostId(postId);

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/posts/${postId}/publish`,
        {},
        { withCredentials: true }
      );

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === postId
            ? { ...post, isPublished: true }
            : post
        )
      );

      setError("");
      window.alert(
        response.data.message || "Post published successfully!"
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to publish this post. Please try again."
      );
    } finally {
      setPublishingPostId(null);
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setEditForm({
      title: post.title || "",
      category: post.category || "General",
      content: post.content || "",
    });
    setError("");
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditForm({
      title: "",
      category: "General",
      content: "",
    });
    setError("");
  };

  const handleUpdatePost = async (event) => {
    event.preventDefault();

    const title = editForm.title.trim();
    const category = editForm.category.trim() || "General";
    const content = editForm.content.trim();

    if (!title || !content) {
      setError("Please provide both a title and content.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${editingPostId}`,
        { title, category, content },
        { withCredentials: true }
      );

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === editingPostId
            ? {
                ...post,
                ...(response.data.post || {}),
                title,
                category,
                content,
                author: post.author,
              }
            : post
        )
      );

      setEditingPostId(null);
      setEditForm({
        title: "",
        category: "General",
        content: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update this post. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingPostId(postId);
    setError("");

    try {
      await axios.delete(
        `http://localhost:5000/api/posts/${postId}`,
        { withCredentials: true }
      );

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId)
      );

      if (editingPostId === postId) {
        handleCancelEdit();
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete this post. Please try again."
      );
    } finally {
      setDeletingPostId(null);
    }
  };

  if (loading) {
    return (
      <main className="my-posts-page">
        <div className="my-posts-status" role="status">
          <span className="loading-spinner"></span>
          <p>Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="my-posts-page">
      <header className="my-posts-header">
        <div>
          <span className="my-posts-eyebrow">YOUR WORKSPACE</span>
          <h1>My Posts</h1>
          <p>
            Create, manage, and publish your ideas from one place.
          </p>
        </div>

        <Link to="/create-post" className="my-posts-create-button">
          <span aria-hidden="true">+</span> Create New Post
        </Link>
      </header>

      {error && (
        <div className="my-posts-error" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <section className="my-posts-stats" aria-label="Post statistics">
        <div className="my-posts-stat-card">
          <span className="stat-icon stat-icon-total" aria-hidden="true">
            ◫
          </span>
          <div>
            <span className="stat-label">Total Posts</span>
            <strong>{posts.length}</strong>
          </div>
        </div>

        <div className="my-posts-stat-card">
          <span
            className="stat-icon stat-icon-published"
            aria-hidden="true"
          >
            ✓
          </span>
          <div>
            <span className="stat-label">Published</span>
            <strong>{publishedCount}</strong>
          </div>
        </div>

        <div className="my-posts-stat-card">
          <span className="stat-icon stat-icon-drafts" aria-hidden="true">
            ✎
          </span>
          <div>
            <span className="stat-label">Drafts</span>
            <strong>{draftCount}</strong>
          </div>
        </div>
      </section>

      <section className="my-posts-content">
        <div className="my-posts-section-heading">
          <div>
            <h2>Your articles</h2>
            <p>Manage your existing posts and their publication status.</p>
          </div>

          <span className="my-posts-total">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="my-posts-empty">
            <span aria-hidden="true" className="my-posts-empty-icon">
              ✎
            </span>
            <h3>Your writing journey starts here</h3>
            <p>
              You haven't created any posts yet. Start writing and share
              your ideas with your readers.
            </p>
            <Link to="/create-post" className="my-posts-create-button">
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="my-posts-list">
            {posts.map((post) => (
              <article className="my-post-card" key={post._id}>
                {editingPostId === post._id ? (
                  <form
                    className="my-post-edit-form"
                    onSubmit={handleUpdatePost}
                  >
                    <div className="my-post-edit-heading">
                      <div>
                        <span className="my-posts-eyebrow">
                          EDIT ARTICLE
                        </span>
                        <h3>Update your post</h3>
                      </div>
                    </div>

                    <div className="my-post-form-field">
                      <label htmlFor={`title-${post._id}`}>
                        Article title
                      </label>
                      <input
                        id={`title-${post._id}`}
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        maxLength={200}
                        required
                      />
                    </div>

                    <div className="my-post-form-field">
                      <label htmlFor={`category-${post._id}`}>
                        Category
                      </label>
                      <input
                        id={`category-${post._id}`}
                        type="text"
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        maxLength={60}
                        placeholder="e.g. Technology"
                      />
                    </div>

                    <div className="my-post-form-field">
                      <label htmlFor={`content-${post._id}`}>
                        Article content
                      </label>
                      <textarea
                        id={`content-${post._id}`}
                        name="content"
                        value={editForm.content}
                        onChange={handleEditChange}
                        rows={10}
                        required
                      />
                    </div>

                    <div className="my-post-actions">
                      <button
                        type="submit"
                        className="my-post-button primary"
                        disabled={saving}
                      >
                        {saving ? "Saving changes..." : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        className="my-post-button secondary"
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="my-post-card-top">
                      <span className="my-post-category">
                        {post.category || "General"}
                      </span>

                      <span
                        className={`my-post-status ${
                          post.isPublished ? "published" : "draft"
                        }`}
                      >
                        <span aria-hidden="true">●</span>
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    <h3 className="my-post-title">{post.title}</h3>

                    <p className="my-post-excerpt">
                      {(post.content || "").length > 220
                        ? `${post.content.substring(0, 220).trim()}...`
                        : post.content}
                    </p>

                    <div className="my-post-card-bottom">
                      <span className="my-post-date">
                        Created {formatDate(post.createdAt)}
                      </span>

                      <div className="my-post-actions">
                        {post.isPublished && (
                          <Link
                            to={`/posts/${post._id}`}
                            className="my-post-button secondary"
                          >
                            View Article
                          </Link>
                        )}

                        {!post.isPublished && (
                          <button
                            type="button"
                            className="my-post-button publish"
                            onClick={() => handlePublish(post._id)}
                            disabled={
                              publishingPostId !== null ||
                              deletingPostId !== null
                            }
                          >
                            {publishingPostId === post._id
                              ? "Publishing..."
                              : "Publish"}
                          </button>
                        )}

                        <button
                          type="button"
                          className="my-post-button secondary"
                          onClick={() => handleEditClick(post)}
                          disabled={
                            saving ||
                            publishingPostId !== null ||
                            deletingPostId !== null
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="my-post-button danger"
                          onClick={() => handleDeletePost(post._id)}
                          disabled={
                            deletingPostId !== null ||
                            publishingPostId !== null
                          }
                        >
                          {deletingPostId === post._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MyPosts;
