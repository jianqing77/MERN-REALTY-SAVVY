import * as UserController from '../controllers/user-controller.js';
import express from 'express';

const router = express.Router();

router.get('/profile', UserController.profile);
router.put('/update-general/:id', UserController.updateUserGeneral);
router.put('/update-password/:id', UserController.updateUserPassword);
router.delete('/delete/:id', UserController.deleteUser);

export default router;
