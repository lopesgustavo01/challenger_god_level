import { Router } from 'express';
// Importamos os "stubs" (funções vazias) do controller
import * as StoreController from '../controllers/StoreController';

const storeRouter = Router();


storeRouter.get('/search', StoreController.searchStores);
storeRouter.get('/', StoreController.getAllStores);

export default storeRouter;