import express from "express";
import { clerkWebHook } from "../controllers/webhook-controllers.js";
import bodyParser from "body-parser";

const router = express.Router();

// Ensure raw body parsing here for Svix verification
router.post("/clerk", bodyParser.raw({ type: "application/json" }), clerkWebHook);

export default router;
