import express from "express";
import authRoutes from "./routes/auth.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import productsRoutes from "./routes/products.route";
import userRoutes from "./routes/user.route";
import settingsRoutes from "./routes/settings.route";
import orderRouter from "./routes/order.route";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/products", productsRoutes)
app.use("/users",userRoutes)
app.use("/settings",settingsRoutes)
app.use("/addToCart",orderRouter)

export default app;
