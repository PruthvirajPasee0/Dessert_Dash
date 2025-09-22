import express from 'express';
import { verifyStockAvailability, processPurchase, getUserPurchases, getAllPurchases, deletePurchase } from '../controllers/purchaseController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Verify stock availability before purchase
router.post('/verify-stock', verifyStockAvailability);

// Process purchase with transaction handling
router.post('/process', protect, processPurchase);

// Get purchase history for authenticated user
router.get('/history', protect, getUserPurchases);

// Get all purchases (admin only)
router.get('/', protect, getAllPurchases);

// Delete a purchase (admin only)
router.delete('/:id', protect, deletePurchase);

export default router;