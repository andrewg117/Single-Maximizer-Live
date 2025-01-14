import express from "express";
import {
  postPayment,
  postDemoPayment,
  embeddedCheckout,
  checkSessionStatus,
  getTrackCreatedStatus,
  updateTrackCreatedStatus,
  deleteTrackPurchase,
} from "../controllers/purchaseController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").post(protect, postPayment);
router.route("/trackcreated").get(protect, getTrackCreatedStatus);
router.route("/updatepurchase").post(protect, updateTrackCreatedStatus);
router.route("/deletepurchase").post(protect, deleteTrackPurchase);
router.route("/checkout").post(protect, embeddedCheckout);
router.route("/checkout:session_id").get(protect, checkSessionStatus);

export default router;
