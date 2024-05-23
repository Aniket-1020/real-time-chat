import path from "path";
import { fileURLToPath } from 'url';
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

// Initialize dotenv
dotenv.config();

// Debug logging for environment variables
console.log("Mongo URI:", process.env.MONGO_DB_URI); // This should print your MongoDB URI
console.log("Port:", process.env.PORT);

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define PORT after loading env variables
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON payloads and cookies
app.use(express.json());
app.use(cookieParser());


// Configure CORS
app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // Enable if your frontend requires sending cookies or other credentials
}));

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static files from the frontend build directory
const staticPath = path.join(__dirname, "../frontend/dist");
console.log("Serving static files from:", staticPath); // Debug statement
app.use(express.static(staticPath));

// Handle SPA routing
app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
});

// Start the server and connect to MongoDB
server.listen(PORT, async () => {
    try {
        await connectToMongoDB();
        console.log(`Server Running on port ${PORT}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with a failure code
    }
});
