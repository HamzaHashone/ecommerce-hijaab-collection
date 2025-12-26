import express from "express";
import authRoutes from "./routes/auth.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import productsRoutes from "./routes/products.route";
import userRoutes from "./routes/user.route";
import settingsRoutes from "./routes/settings.route";
import orderRouter from "./routes/order.route";
import dotenv from "dotenv";
import voucherRouter from "./routes/voucher.route";

dotenv.config();

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

// Also allow Vercel preview deployments
const isVercelOrigin = (origin: string): boolean => {
  return origin.includes(".vercel.app");
};

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin) || isVercelOrigin(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ CORS: Blocked origin: ${origin}`);
        callback(new Error(`CORS: Origin ${origin} is not allowed`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cookieParser());

// Health check route (before CORS to allow direct browser access)
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.use("/auth", authRoutes);
app.use("/products", productsRoutes)
app.use("/users",userRoutes)
app.use("/settings",settingsRoutes)
app.use("/cart",orderRouter)
app.use("/voucher",voucherRouter)

export default app;
