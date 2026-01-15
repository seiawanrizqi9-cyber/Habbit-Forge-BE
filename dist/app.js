// app.ts - WITH YOUR UPLOAD MIDDLEWARE
import express, {} from "express";
import { upload } from "./middleware/upload.middleware.js";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import checkInRoutes from "./routes/checkIn.route.js";
import habitRoutes from "./routes/habit.route.js";
import profileRoutes from "./routes/profile.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import statRoutes from "./routes/stat.route.js";
const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("query parser", "extended");
app.use(express.static("public"));
app.use("/uploads", express.static("public/uploads"));
app.use((req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
        upload.none()(req, res, (err) => {
            if (err) {
                console.error("Multer error:", err);
                return res.status(400).json({
                    success: false,
                    message: "Error parsing form data"
                });
            }
            next();
        });
    }
    else {
        next();
    }
});
app.use((req, _res, next) => {
    console.log(`${req.method}: ${req.path}`);
    req.startTime = Date.now();
    next();
});
app.get("/", (_req, res) => {
    res.json({
        status: "OK",
        message: "Habit Tracker API",
        timestamp: new Date().toISOString()
    });
});
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/checkIn", checkInRoutes);
app.use("/api/habit", habitRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/stat", statRoutes);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});
import { errorHandler } from "./middleware/error.handler.js";
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map
