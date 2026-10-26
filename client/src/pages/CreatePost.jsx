
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CreatePost.css";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const wordCount = content.trim()
    ? content.trim().split(/\s+/).length
    : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setMessage("Please enter both a title and article content.");
      setMessageType("error");
      return;
    }

    setMessage("");
    setMessageType("");
    setSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/posts",
        {
          title: trimmedTitle,
          category,
          content: trimmedContent,
        },
        { withCredentials: true }
      );

      setMessage(
        response.data.message || "Your post has been saved as a draft."
      );
      setMessageType("success");
      setTitle("");
      setCategory("General");
      setContent("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to save your post. Please try again."
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="create-post-page">
      <header className="create-post-header">
        <span className="create-post-eyebrow">YOUR WRITING SPACE</span>
        <h1>Create a new article</h1>
        <p>
          Turn your ideas into something worth sharing. Write your article
          and save it as a draft when you're ready.
        </p>
      </header>

      <div className="create-post-layout">
        <section className="create-post-editor">
          <form onSubmit={handleSubmit}>
            <div className="create-post-field">
              <label htmlFor="post-title">Article title</label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Give your article a clear title"
                maxLength={200}
                required
                disabled={submitting}
              />
              <span className="create-post-field-hint">
                Make it clear and engaging.
              </span>
            </div>

            <div className="create-post-field">
              <label htmlFor="post-category">Category</label>
              <select
                id="post-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                disabled={submitting}
              >
                <option value="General">General</option>
                <option value="Technology">Technology</option>
                <option value="Education">Education</option>
                <option value="Business">Business</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>

            <div className="create-post-field">
              <div className="create-post-content-heading">
                <label htmlFor="post-content">Article content</label>
                <span>{wordCount} words</span>
              </div>

              <textarea
                id="post-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Start writing your article here..."
                rows={16}
                required
                disabled={submitting}
              />

              <span className="create-post-field-hint">
                Share your knowledge, experiences, or ideas with your
                readers.
              </span>
            </div>

            {message && (
              <div
                className={`create-post-message ${messageType}`}
                role={messageType === "error" ? "alert" : "status"}
              >
                <p>{message}</p>
              </div>
            )}

            <div className="create-post-actions">
              <button
                type="submit"
                className="create-post-submit"
                disabled={submitting}
              >
                {submitting ? "Saving draft..." : "Save as Draft"}
              </button>

              <Link
                to="/my-posts"
                className="create-post-cancel"
              >
                My Posts
              </Link>
            </div>
          </form>
        </section>

        <aside className="create-post-sidebar">
          <div className="create-post-tip">
            <span className="create-post-tip-icon" aria-hidden="true">
              ✎
            </span>
            <h2>Before you save</h2>
            <ul>
              <li>Choose a title that reflects your main idea.</li>
              <li>Select the category that best fits your article.</li>
              <li>Review your content for clarity and spelling.</li>
            </ul>
          </div>

          <div className="create-post-draft-note">
            <span aria-hidden="true">ⓘ</span>
            <div>
              <h3>Draft mode</h3>
              <p>
                Saving your article does not publish it. You can review
                and publish it later from My Posts.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default CreatePost;
