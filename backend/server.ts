import express from "express";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config();
import schedule from "cookie-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "./config/db";
import webhookRoutes from "./routes/webhookRoutes";
import trackRoutes from "./routes/trackRoutes";
import userRoutes from "./routes/userRoutes";
import emailRoutes from "./routes/emailRoutes";
import imageRoutes from "./routes/imageRoutes";
import audioRoutes from "./routes/audioRoutes";
// import purchaseRoutes from "./routes/purchaseRoutes";
import { sendScheduledEmail } from "./controllers/emailController";
import errorHandler from "./middleware/errorMiddleware";
const port = process.env.Port || 5000;

connectDB();

const app = express();

// Daily function
// schedule.scheduleJob({ hour: 12, minute: 0 }, function () {
//   sendScheduledEmail();
// });


app.use("/api/webhook", webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? `http://localhost:${3000}`
        : `http://ec2-35-153-192-158.compute-1.amazonaws.com:${3000}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type"],
  })
);

app.use("/api/tracks", trackRoutes);
app.use("/api/users", userRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/audio", audioRoutes);
// app.use("/api/purchase", purchaseRoutes);

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../frontend/build')))
//   // app.use(express.static('frontend/build'))
//   // app.use(express.static(process.env.RENDER_STATIC_URL))

//   app.get('*', (req, res) =>
//     res.sendFile(
//       path.resolve(__dirname, 'frontend', 'build', 'index.html')
//       // path.resolve(process.env.RENDER_STATIC_URL, '../', 'frontend', 'build', 'index.html')
//     )
//   )
// } else {
//   app.get('/', (req, res) => res.send('Set env to production'))
// }

app.get("/", (req, res) => {
  res.json({ Connection: "Success" });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
