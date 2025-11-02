import { Router } from 'express';
import { getChannelsMostMonthUsed, getDailyAnalysis, getItemHistoryByMonth, getTopDiscountReasonsMonth, getTopItemsByMonth } from '../controllers/AnalyticsController';

const analyticsRouter = Router();

analyticsRouter.get('/', getDailyAnalysis);

// itens
analyticsRouter.get('/items', getTopItemsByMonth);
analyticsRouter.get('/item-history', getItemHistoryByMonth);
analyticsRouter.get('/bestchannel', getChannelsMostMonthUsed);
analyticsRouter.get('/discount-reasons', getTopDiscountReasonsMonth);

export default analyticsRouter;