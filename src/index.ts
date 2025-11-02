import express, { Router } from "express";
import morgan from "morgan";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

// routes
import salesRoute from "./routes/SalesRoutes"
import storeRouter from "./routes/StoreRoutes"
import analyticsRouter from "./routes/AnalyticsRoutes";
import router from "./routes/IARouter";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname,"..", 'public')));

// rotas
app.use("/api/sales", salesRoute)
app.use("/api/store", storeRouter)
app.use("/api/analytics", analyticsRouter)
app.use("/api", router)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'..', 'public', 'index.html'));
});

// Inicia o servidor
app.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port", process.env.PORT || 3000)
);
