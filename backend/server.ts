import express from "express";
import colors from "colors"; // For console log colors
import dotenv from "dotenv"; // To load environment variables from a .env file
dotenv.config();
import schedule from "node-schedule";
import cookieParser from "cookie-parser";
import cors from "cors"; // To enable Cross-Origin Resource Sharing
import session from "express-session";
import MongoStore from "connect-mongo"; // For storing session data in MongoDB
import { StatusCodes } from "http-status-codes";
import connectDB from "./config/db"; // Function to connect to the database
import webhookRoutes from "./routes/webhookRoutes"; // Routes for webhook-related endpoints
import trackRoutes from "./routes/trackRoutes"; // Routes for track-related endpoints
import userRoutes from "./routes/userRoutes"; // Routes for user-related endpoints
import emailRoutes from "./routes/emailRoutes"; // Routes for email-related endpoints
import imageRoutes from "./routes/imageRoutes"; // Routes for image-related endpoints
import audioRoutes from "./routes/audioRoutes"; // Routes for audio-related endpoints
import purchaseRoutes from "./routes/purchaseRoutes"; // Routes for purchase-related endpoints
import { sendScheduledEmail } from "./controllers/emailController"; // Function to send scheduled emails
// TODO: check error handling for all routes
// TODO: Add status codes
import { errorHandler, clientErrorHandler } from "./middleware/errorMiddleware"; // Middleware for handling errors
const MDB_URI: string = process.env.MDB_URI as string;
const SESSION_SECRET: string = process.env.SESSION_SECRET as string;

const port = process.env.Port || 5000; // Define the port number, default to 5000

connectDB(); // Connect to the database

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // Middleware to parse cookies

// Daily function to send scheduled emails
// Uncomment the schedule function to enable daily email sending at 12:00 PM
// schedule.scheduleJob({ hour: 12, minute: 0 }, function () {
//   sendScheduledEmail();
// });
// sendScheduledEmail();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? `http://localhost:${3000}`
        : `serverURL:${3000}`, // Allow requests from specific origins based on environment
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
    optionsSuccessStatus: 200, // Status for successful OPTIONS requests
    allowedHeaders: ["Content-Type"], // Allow specific headers
  })
);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: { maxAge: 1 * 10 * 60 * 1000, sameSite: "strict", secure: "auto" },

    store: MongoStore.create({
      mongoUrl: MDB_URI,
    }),
  })
);

app.use("/api/webhook", webhookRoutes); // Use webhook routes for /api/webhook path

app.use("/api/tracks", trackRoutes); // Use track routes for /api/tracks path
app.use("/api/users", userRoutes); // Use user routes for /api/users path
app.use("/api/email", emailRoutes); // Use email routes for /api/email path
app.use("/api/image", imageRoutes); // Use image routes for /api/image path
app.use("/api/audio", audioRoutes); // Use audio routes for /api/audio path
app.use("/api/purchase", purchaseRoutes); // Use purchase routes for /api/purchase path

// favicon.ico route to prevent 404 errors
app.get("/favicon.ico", (req, res) => res.status(204).end());

app.get("/", (req, res) => {
  res.send("SingleMax Server is running..."); // Default route to test server connection
});

// Catch-all route to handle 404 errors
// app.get("*", (req, res, next) => {
//   try {
//     // check if route does not exist
//     if (req.statusCode === 404) {
//       throw new Error(`Route not found: ${req.originalUrl}`);
//     }

//     next();
//   } catch (error: any) {
//     res.status(404);
//     next(error);
//   }
// });

app.use(errorHandler); // Error handling middleware
app.use(clientErrorHandler); // Client error handling middleware

app.listen(port, () => console.log(`Server started on port ${port}`)); // Start the server on the defined port
