import express from "express";
const router = express.Router();
import {
  uploadAudio,
  getAudio,
  updateAudio,
  deleteAudio,
} from "../controllers/audioController";
import { protect } from "../middleware/authMiddleware";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/").post(protect).post(upload.single("trackAudio"), uploadAudio);
router
  .route("/:id")
  .get(protect, getAudio)
  .put(protect)
  .put(upload.single("trackAudio"), updateAudio)
  .delete(protect, deleteAudio);

export default router;
