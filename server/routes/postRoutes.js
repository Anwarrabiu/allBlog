
const express = require("express");

const {
  createPost,
  getPublishedPosts,
  getMyPosts,
  publishPost,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// PUBLIC ROUTES
    //Because Express checks routes in order, /my-posts must appear before /:id. 
    //Otherwise, Express may interpret my-posts as a post ID.

router.get("/", getPublishedPosts);

// Protected route: get the logged-in user's posts
router.get("/my-posts", protect, getMyPosts);

router.get("/:id", getPostById);

//PRIVATE ROUTES
  // Protected route: create a post
router.post("/", protect, createPost);

// Protected route: publish a post
router.patch("/:id/publish", protect, publishPost);

// Protected route: update a post
router.put("/:id", protect, updatePost);

// Protected route: delete a post
router.delete("/:id", protect, deletePost);

module.exports = router;
