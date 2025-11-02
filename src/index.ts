import express, { Router } from "express";
import morgan from "morgan";
import cors from "cors";
import { pool } from "./config/db";

// routes
import salesRoute from "./routes/SalesRoutes"
import storeRouter from "./routes/StoreRoutes"
import analyticsRouter from "./routes/AnalyticsRoutes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// rotas
app.use("/api/sales", salesRoute)
app.use("/api/store", storeRouter)
app.use("/api/analytics", analyticsRouter)


app.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port", process.env.PORT || 3000)
);
