import express from "express";
import {
  loginUser,
  loginGoogle,
  redirectGoogle,
  logoutUser,
  registerUser,
  checkRegisterEmail,
  forgotPassword,
  resetPassword,
  updateUser,
  getMe,
  emailData,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/login/google", loginGoogle);
router.get("/redirect/google", redirectGoogle);
router.post("/logout", logoutUser);
router.route("/email").post(checkRegisterEmail);
router.route("/email/:token").get(emailData);
router.route("/reset").post(forgotPassword).put(resetPassword);
router.route("/me").get(protect, getMe).put(protect, updateUser);

export default router;
