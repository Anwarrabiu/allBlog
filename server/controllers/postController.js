
const mongoose = require("mongoose");
const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a title and content",
      });
    }

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      category:
        typeof category === "string" && category.trim()
          ? category.trim()
          : "General",
      author: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the post",
    });
  }
};

const getPublishedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublished: true })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get posts error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching posts",
    });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user.id,
    })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get my posts error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching your posts",
    });
  }
};

const publishPost = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.isPublished = true;
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post published successfully",
      post,
    });
  } catch (error) {
    console.error("Publish post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while publishing the post",
    });
  }
};

const getPostById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findOne({
      _id: req.params.id,
      isPublished: true,
    }).populate("author", "username");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the post",
    });
  }
};

// Update a post belonging to the logged-in user.
const updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a title and content",
      });
    }

    if (category !== undefined && typeof category !== "string") {
      return res.status(400).json({
        success: false,
        message: "Category must be text",
      });
    }

    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.title = title.trim();
    post.content = content.trim();

    if (category !== undefined) {
      post.category = category.trim() || "General";
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Update post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the post",
    });
  }
};

// Delete a post belonging to the logged-in user.
const deletePost = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the post",
    });
  }
};

module.exports = {
  createPost,
  getPublishedPosts,
  getMyPosts,
  publishPost,
  getPostById,
  updatePost,
  deletePost,
};
