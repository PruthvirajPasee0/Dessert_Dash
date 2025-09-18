import express from 'express';
import { getAllSweets } from '../controllers/sweetController';

const router = express.Router();

router.get('/', getAllSweets);

export default router;