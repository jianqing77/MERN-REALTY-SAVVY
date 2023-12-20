import * as AuthController from '../controllers/auth-controller.js';
import express from 'express';

const router = express.Router();

router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.post('/profile', AuthController.profile);
router.post('/signout', AuthController.signout);
router.post('/update', AuthController.update);

export default router;
