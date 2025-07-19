import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

// Middleware imports
import { errorHandler, routeNotFound } from "./middleware/errorMiddlewares.js";
// import { limiter } from './middleware/limiterMiddleware.js';

// Route and configuration imports
import routes from "./routes/index.js";
import dbConnection from "./config/db.js";
import setupSwaggerDocs from "./swagger.js";

// Path utilities for ES modules
import { fileURLToPath } from "url";
import { dirname, join } from "path";

/**
 * Initialize Express Application
 * 
 * This sets up the backend server with middleware, routes,
 * database connection, and error handling.
 */

// 1. Database Connection
dbConnection();

// 2. Express App Initialization
const app = express();

// 3. Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ======================
// MIDDLEWARE CONFIGURATION
// ======================

// CORS Configuration
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
            "https://horizon-task-manager-app.netlify.app",
            "https://horizon-task-manager-client.vercel.app"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// Request Parsing Middleware
app.use(express.json());          // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded
app.use(cookieParser());          // For parsing cookies

// Development Logger
app.use(morgan("dev"));           // HTTP request logger

// Rate Limiter (commented out by default)
// app.use(limiter);

// ======================
// STATIC FILE HANDLING
// ======================
app.use("/images", express.static(join(__dirname, "public/images")));
app.use("/public/images", express.static("public/images"));

// ======================
// ROUTE CONFIGURATION
// ======================

// Health Check Route (Basic Route)
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is up and running",
        timestamp: new Date().toISOString()
    });
});

// API Documentation Route
app.get("/docs", (req, res) => {
    res.redirect("/api-docs");
});

// Main API Routes (versioned under /api)
app.use("/api", routes);

// Swagger Documentation Setup
setupSwaggerDocs(app);

// ======================
// ERROR HANDLING
// ======================
app.use(routeNotFound);   // Handle 404 routes
app.use(errorHandler);    // Custom error handler

// ======================
// SERVER INITIALIZATION
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});