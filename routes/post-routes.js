import express from "express";
import { getPost, getPosts, createPost, deletePost, uploadAuth, featurePost } from "../controllers/post-controllers.js";
import increaseVisit from "../middlewares/increaseVisit.js";
const router = express.Router();

router.get("/upload-auth", uploadAuth);

router.get("/", getPosts);
router.get("/:slug", increaseVisit, getPost);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.patch("/feature", featurePost);

export default router;