import express from 'express';
import * as ApartmentController from '../controllers/apartment-controller.js';

const router = express.Router();

// Endpoint to retrieve listings from the public API
router.get('/', ApartmentController.getPublicListings);
router.get(
    '/rentals',
    ApartmentController.getLocationId,
    ApartmentController.getRentalListings
);

router.get(
    '/sales',
    ApartmentController.getLocationId,
    ApartmentController.getSaleListings
);

export default router;
