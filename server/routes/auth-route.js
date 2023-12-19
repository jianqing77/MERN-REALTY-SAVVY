import * as AuthController from '../controllers/auth-controller.js';
import express from 'express';

const router = express.Router();

router.post('/signup', AuthController.signUp);
// router.get('/signin', AuthController.signIn);
// router.get('/logout', AuthController.logOut);

export default router;
