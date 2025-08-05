import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import authRoutes from "./routes/auth";
import eventTypeRoutes from "./routes/eventTypes";
import vendorRoutes from "./routes/vendors";
import wellnessEventRoutes from "./routes/wellnessEvents";
import { errorHandler, notFound } from "./middleware/errorHandler";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  })
);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Routes
app.use("/auth", authRoutes);
app.use("/event-types", eventTypeRoutes);
app.use("/vendors", vendorRoutes);
app.use("/wellness-events", wellnessEventRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Connect DB and start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
