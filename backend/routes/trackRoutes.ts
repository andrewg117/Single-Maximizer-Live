import express from "express";
import {
  getTracks,
  getSingle,
  setTrack,
  updateTrack,
  deleteTrack,
} from "../controllers/trackController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").get(protect, getTracks).post(protect, setTrack);
router
  .route("/:id")
  .get(protect, getSingle)
  .put(protect, updateTrack)
  .delete(protect, deleteTrack);

export default router;
