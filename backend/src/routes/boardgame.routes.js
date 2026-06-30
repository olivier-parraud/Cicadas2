import express from 'express';
import { getBoardGames } from '../controllers/boardgame.controller.js';

const router = express.Router();

router.get('/', getBoardGames);

export default router;
