import express from 'express';
import { getUserProfile, updateProfilePicture } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.post('/profile/picture', protect, upload.single('image'), updateProfilePicture);

export default router;