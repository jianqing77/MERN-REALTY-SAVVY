import * as AuthController from '../controllers/auth-controller.js';
import express from 'express';

const router = express.Router();

router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.get('/signout', AuthController.signout);
router.post('/authgoogle', AuthController.google);
// router.delete('/delete/:id', AuthController.deleteUser);

export default router;
