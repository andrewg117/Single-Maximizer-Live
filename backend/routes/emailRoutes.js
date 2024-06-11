import express from "express";
import { sendEmail } from "../controllers/emailController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// POST request to send an email
router.route("/").post(protect, sendEmail);

export default router;
