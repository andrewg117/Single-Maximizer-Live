import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  checkRegisterEmail,
  forgotPassword,
  resetPassword,
  updateUser,
  getMe,
  emailData,
  checkUserToken,
  wakeDemoServer,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.route("/email").post(checkRegisterEmail);
router.route("/email/:token").get(emailData);
router.route("/reset").post(forgotPassword).put(resetPassword);
router.route("/me").get(protect, getMe).put(protect, updateUser);
router.route("/token").get(checkUserToken);
router.route("/wakeserver").get(wakeDemoServer);

export default router;
