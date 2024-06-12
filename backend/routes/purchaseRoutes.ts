import express from "express";
import {
  postPayment,
  postDemoPayment,
} from "../controllers/purchaseController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").post(protect, postPayment);

export default router;
