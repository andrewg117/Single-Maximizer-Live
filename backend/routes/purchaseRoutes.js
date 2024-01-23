const express = require("express");
const router = express.Router();
const {
  postPayment,
  postDemoPayment,
} = require("../controllers/purchaseController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, postPayment);

module.exports = router;
