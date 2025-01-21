import Router from 'express';
import {
    createUserAccount,
    getCurrentUserProfile,
    loginUser,
    logOutUser,
    updateUserProfile,
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import upload from '../utils/multer.js';
const router = Router();

// Auth Routes
router.route('/signup').post(createUserAccount);
router.route('login').post(loginUser);
router.post('signout').post(logOutUser);

// Profile Routes
router.route('profile').get(isAuthenticated, getCurrentUserProfile);
router
    .route('profile')
    .patch(isAuthenticated, upload.single('avatar'), updateUserProfile);

export default Router;
