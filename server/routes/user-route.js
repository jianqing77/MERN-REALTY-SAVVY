import * as UserController from '../controllers/user-controller.js';
import express from 'express';
import { authenticateAndUpdateRequest } from '../utils/util.js';

const router = express.Router();

// Retrieve the profile for the current user
router.get('/profile', UserController.profile);

// Update general information for a specific user by ID
router.put(
    '/:id/general',
    authenticateAndUpdateRequest,
    UserController.updateUserGeneral
);

// Update password for a specific user by ID
router.put(
    '/:id/password',
    authenticateAndUpdateRequest,
    UserController.updateUserPassword
);

// Delete a specific user by ID
router.delete('/:id', UserController.deleteUser);

export default router;
