import express from "express";
import {
  uploadImage,
  getImage,
  updateImage,
  uploadPress,
  getPress,
  deleteImage,
  deletePress,
} from "../controllers/imageController";
import { protect } from "../middleware/authMiddleware";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route("/")
  .post(protect)
  .post(upload.single("Image"), uploadImage)
  .get(protect, getImage);

router
  .route("/:id")
  .put(protect)
  .put(upload.single("Image"), updateImage)
  .delete(protect, deleteImage);

router
  .route("/press")
  .post(protect)
  .post(upload.array("Press"), uploadPress)
  .get(protect, getPress);

router.route("/press/:id").delete(protect, deletePress);

export default router;
