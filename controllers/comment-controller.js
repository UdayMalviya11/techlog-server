import Comment from "../models/comment-model.js";
import User from "../models/user-model.js";

export const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username img")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json("Error fetching comments: " + error.message);
  }
};

export const addComment = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.params.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  try {
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json("User not found!");
    }

    if (!req.body.text) {
      return res.status(400).json("Comment text is required!");
    }

    const newComment = new Comment({
      ...req.body,
      user: user._id,
      post: postId,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json("Error saving comment: " + error.message);
  }
};

export const deleteComment = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const id = req.params.id;
  

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

   const role = req.auth.sessionClaims?.metadata?.role || "user";
  
      if(role == "admin") {
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json("Comment has been deleted");
      }
  try {
    const role = req.auth.sessionClaims?.metadata?.role || "user";

    if (role === "admin") {
      await Comment.findByIdAndDelete(req.params.id);
      return res.status(200).json("Comment has been deleted");
    }

    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json("User not found!");
    }

    const deletedComment = await Comment.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!deletedComment) {
      return res.status(403).json("You can delete only your comment!");
    }

    res.status(200).json({ message: "Comment deleted", deletedComment });
  } catch (error) {
    res.status(500).json("Error deleting comment: " + error.message);
  }
};
