import express from 'express';
import { body, validationResult } from 'express-validator';

import * as ListingController from '../controllers/listing-controller.js';

const router = express.Router();

// Validation middleware
const validateListing = [
    body('title').notEmpty().withMessage('Title is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Specific routes: the router operates on a first-match principle
router.get('/rental', ListingController.findRentalListings);
router.get('/sale', ListingController.findSaleListings);

// Parameterized routes
router.get('/:id', ListingController.findListingById); // Retrieve a single listing by ID

// Other routes
// Route with validation
router.get('/', ListingController.findListingByCurrentUser); // Retrieve all listings
router.post('/', validateListing, ListingController.createListing); // Create a new listing
router.put('/:id', validateListing, ListingController.updateListing); // Update an existing listing by ID
router.delete('/:id', ListingController.deleteListing); // Delete an existing listing by ID

export default router;
