import express from 'express';
import * as ApartmentController from '../controllers/apartment-controller.js';

const router = express.Router();

// Endpoint to retrieve listings from the public API
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

router.get(
    '/property/:propertyId', // :propertyId is req.params.propertyId
    ApartmentController.getPropertyDetails
);

export default router;
