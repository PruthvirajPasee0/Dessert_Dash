import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { isAdmin } from '../middleware/adminMiddleware';
import {
    getAllSweets,
    createSweet,
    updateSweet,
    deleteSweet,
    adjustQuantity
} from '../controllers/sweetController';

const router = express.Router();

// Public route
router.get('/', getAllSweets);

// Admin protected routes
router.use(protect, isAdmin);
router.post('/', createSweet);
router.put('/:id', updateSweet);
router.delete('/:id', deleteSweet);
router.patch('/:id/quantity', adjustQuantity);

export default router;