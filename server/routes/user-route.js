import * as UserController from '../controllers/user-controller.js';
import express from 'express';

const router = express.Router();

router.get('/test', UserController.test);

export default router;
