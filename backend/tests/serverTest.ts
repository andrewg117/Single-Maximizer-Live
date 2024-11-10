import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"; // To load environment variables from a .env file
dotenv.config();
import { errorHandler } from "../middleware/errorMiddleware"; // Middleware for handling errors
import trackRoutes from "../routes/trackRoutes"; // Routes for track-related endpoints
import userRoutes from "../routes/userRoutes"; // Routes for user-related endpoints
import emailRoutes from "../routes/emailRoutes"; // Routes for email-related endpoints
import imageRoutes from "../routes/imageRoutes"; // Routes for image-related endpoints
import audioRoutes from "../routes/audioRoutes"; // Routes for audio-related endpoints
import purchaseRoutes from "../routes/purchaseRoutes"; // Routes for purchase-related endpoints

const port = 5001;
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies

app.use("/api/tracks", trackRoutes); // Use track routes for /api/tracks path
app.use("/api/users", userRoutes); // Use user routes for /api/users path
app.use("/api/email", emailRoutes); // Use email routes for /api/email path
app.use("/api/image", imageRoutes); // Use image routes for /api/image path
app.use("/api/audio", audioRoutes); // Use audio routes for /api/audio path
app.use("/api/purchase", purchaseRoutes); // Use purchase routes for /api/purchase path

app.get("/", (req, res) => {
  res.json({ Connection: "Success" }); // Default route to test server connection
});

app.use(errorHandler);

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
); // Start the server on the defined port

export default server;
