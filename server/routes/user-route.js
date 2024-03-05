import * as UserController from '../controllers/user-controller.js';
import express from 'express';
import { authenticateAndUpdateRequest } from '../utils/util.js';

const router = express.Router();

router.get('/profile', UserController.profile);
router.put('/update-general/:id', UserController.updateUserGeneral);
router.put(
    '/update-password/:id',
    authenticateAndUpdateRequest,
    UserController.updateUserPassword
);
router.delete('/delete/:id', UserController.deleteUser);

export default router;
