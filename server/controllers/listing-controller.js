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

export const findRentalListings = catchAsync(async (req, res) => {
    const { location, petPolicy, minPrice, maxPrice } = req.query;

    if (!location) {
        return res.status(400).json({
            success: false,
            message: "Required query parameter 'location' is missing.",
        });
    }
    const priceRange = { min: minPrice, max: maxPrice };
    const listings = await InternalListingDAO.findRentalListings(
        location,
        petPolicy,
        priceRange
    );

    res.status(200).json({
        success: true,
        results: listings.length,
        data: listings,
    });
});

//  function to find sale listings with optional filters
export const findSaleListings = catchAsync(async (req, res) => {
    const { location, minHomeAge, maxHomeAge, minPrice, maxPrice } = req.query;

    const homeAge = { min: minHomeAge, max: maxHomeAge };
    const priceRange = { min: minPrice, max: maxPrice };
    const listings = await InternalListingDAO.findSaleListings(
        location,
        homeAge,
        priceRange
    );

    res.status(200).json({
        success: true,
        results: listings.length,
        data: listings,
    });
});

// export const findListingByLocation = catchAsync(async (req, res) => {
//     const { query } = req.query;

//     if (!query) {
//         return res.status(400).json({
//             success: false,
//             message: 'No search query provided',
//         });
//     }

//     const listings = InternalListingDAO.findListingByLocation({
//         address: query,
//         city: query,
//         state: query,
//         zipCode: query,
//     });

//     res.status(200).json({
//         success: true,
//         results: listings.length,
//         data: listings,
//     });
// });

export const findListingByCurrentUser = catchAsync(async (req, res) => {
    const userId = req.session['currentUser']['_id'];
    console.log('user id founded in the listing controller:  ' + userId);
    const foundedListing = await InternalListingDAO.findListingsByUserId(userId);
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
    console.log('ID:', id);
    console.log('Update Data:', updateData);
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
