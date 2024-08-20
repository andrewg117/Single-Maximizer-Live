import express from "express";
import {
  postPayment,
  postDemoPayment,
  embeddedCheckout,
  checkSessionStatus,
} from "../controllers/purchaseController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").post(protect, postPayment);
router.route("/checkout").post(protect, embeddedCheckout);
router.route("/checkout:session_id").get(protect, checkSessionStatus);

export default router;
