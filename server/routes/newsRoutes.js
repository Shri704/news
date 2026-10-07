import express from 'express';
import { processNewsSearch } from '../controllers/newsController.js';

const router = express.Router();

router.post('/search', processNewsSearch);

export default router;