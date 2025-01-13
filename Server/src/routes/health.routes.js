import express from 'express';
import { checkHealth } from '../controllers/health.controller.js';

const router = express.Router();

router.route('/').get(checkHealth);

export default router;
