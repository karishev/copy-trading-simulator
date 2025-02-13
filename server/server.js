import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

// SETUP
dotenv.config({ path: "./server/config/.env" });

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
  origin: "http://localhost:3000", // React app's URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Add this middleware to set secure cookie options
app.use((req, res, next) => {
  res.cookie('options', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  next();
});

// DATABASE
const DB = process.env.MONGO_URI;

mongoose
  .connect(DB, {
    useNewUrlParser: true,      // Use the new URL parser
    useUnifiedTopology: true,   // Use unified topology for MongoDB driver
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ROUTES
import authRouter from "./routes/authRoutes.js";
import dataRouter from "./routes/dataRoutes.js";
import newsRouter from "./routes/newsRoutes.js";
import stockRouter from "./routes/stockRoutes.js";

app.use("/api/auth", authRouter);
app.use("/api/data", dataRouter);
app.use("/api/news", newsRouter);
app.use("/api/stock", stockRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/../client/build/index.html"));
  });
}

// APP
app.listen(port)
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const newPort = port + 1;
      console.log(`Port ${port} is busy, trying ${newPort}...`);
      app.listen(newPort);
      app.set('port', newPort);
    } else {
      console.error('Server error:', err);
    }
  })
  .on('listening', () => {
    console.log(`Server is running on port ${app.get('port') || port}`);
  });
