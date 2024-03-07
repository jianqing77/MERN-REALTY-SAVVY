import express from 'express';
import * as ListingController from '../controllers/listing-controller.js';

const router = express.Router();

router.get('/', ListingController.findAllListings); // Retrieve all listings
router.get('/:id', ListingController.findListingById); // Retrieve a single listing by ID
router.post('/', ListingController.createListing); // Create a new listing
router.put('/:id', ListingController.updateListing); // Update an existing listing by ID
router.delete('/:id', ListingController.deleteListing); // Delete an existing listing by ID

export default router;
