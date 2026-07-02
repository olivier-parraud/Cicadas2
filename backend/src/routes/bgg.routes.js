import { Router } from 'express';
import { searchGames, getGameDetails } from '../controllers/bgg.controller.js';

const router = Router();

router.get('/search', searchGames);
router.get('/thing', getGameDetails);

export default router;
