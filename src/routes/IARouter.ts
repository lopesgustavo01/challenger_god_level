import { Router } from 'express';
import { getStoreAIInsights } from "../controllers/AnalyticsIaController";

const router = Router()

router.get("/ai/insights", getStoreAIInsights);

export default router