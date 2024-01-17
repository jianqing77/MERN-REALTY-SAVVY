import * as UserController from '../controllers/user-controller.js';
import express from 'express';

const router = express.Router();

router.post('/profile', UserController.profile);
router.post('/update/:id', UserController.updateUser);

export default router;
