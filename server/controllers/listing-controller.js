import ErrorHandler from '../utils/ErrorHandler.js';
import catchAsync from '../utils/catchAsync.js';
import InternalListingDAO from '../dao/internal-listing-dao.js';

export const findAllListings = catchAsync(async (req, res) => {
    const listings = await InternalListingDAO.findAllListing();
    res.status(200).json({
        success: true,
        results: listings.length,
        data: listings,
    });
});

export const findListingById = catchAsync(async (req, res) => {
    const { id } = req.params; // Get the ID from the URL parameters
    const foundedListing = await InternalListingDAO.findListingById(id);
    res.status(200).json(foundedListing);
});

export const createListing = catchAsync(async (req, res) => {
    // Extract the currentUser from session to automatically fill in the createdBy attribute
    const currentUser = req.session['currentUser'];
    if (!currentUser) {
        console.log('No current user');
    }
    // console.log('current user is: ' + JSON.stringify(currentUser));
    const userId = currentUser._id;
    const listingData = {
        ...req.body, // Spread the existing body to maintain other properties
        createdBy: userId, // Add the createdBy field
    };
    const newListing = await InternalListingDAO.createListing(listingData);
    res.status(201).json(newListing);
});

export const updateListing = catchAsync(async (req, res) => {
    const { id } = req.params; // Get the ID from the URL parameters
    const updateData = req.body;
    console.log('ID:', id); // Check the ID
    console.log('Update Data:', updateData); // Check the update data
    const updatedListing = await InternalListingDAO.updateListing(id, updateData);
    res.status(201).json(updatedListing);
});

export const deleteListing = catchAsync(async (req, res) => {
    const { id } = req.params; // Get the ID from the URL parameters
    const deletedListing = await InternalListingDAO.deleteListing(id);

    // Check if the deletion was successful, and if not, return a 404 error.
    if (!deletedListing) {
        return res.status(404).json({ message: 'Listing not found.' });
    }
    // If the deletion was successful, return a 200 status code.
    res.status(200).json({ message: 'Listing deleted successfully.' });
});
