import { Router } from 'express';
// Importamos o "stub" do controller
import * as SalesController from '../controllers/SalesControlles';

const salesRouter = Router();

salesRouter.get('/daily', SalesController.getSalesByStore);

export default salesRouter;