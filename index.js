import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middleware/errorMiddlewares.js";

// Import routes and utilities
import routes from "./routes/index.js";
import dbConnection from "./config/db.js";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Establish database connection
dbConnection();

// Create express app instance
const app = express();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware setup
// Enable CORS for specific origins and methods
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://horizon-task-app.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Log HTTP requests
app.use(morgan("dev"));

app.use("/images", express.static(join(__dirname, "public/images")));
app.use("/public/images", express.static("public/images"));

// API routes
app.use("/api", routes);

// Handle errors
app.use(routeNotFound);
app.use(errorHandler);

// Basic route to check server setup
app.get("/", (req, res) => {
  res.send("Server is up and running");
});

// Define the port and start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});