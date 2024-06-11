import express from "express";
import { postEndpoint } from "../controllers/purchaseController";

const router = express.Router();

router.route("").post(express.raw({ type: "application/json" }), postEndpoint);

export default router;
