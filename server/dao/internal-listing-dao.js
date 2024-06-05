import InternalListingModel from '../models/internal-listing-model.js';
import ErrorHandler from '../utils/ErrorHandler.js'; // Update with the actual path

const InternalListingDao = {
    findAllListing: async () => {
        try {
            const listings = await InternalListingModel.find({});
            return listings;
        } catch (error) {
            throw new ErrorHandler('Error fetching listings', 500);
        }
    },
    createListing: async (listingData) => {
        try {
            const listing = new InternalListingModel(listingData);
            return await listing.save();
        } catch (error) {
            throw new ErrorHandler('Error creating listing', 500);
        }
    },
    findListingById: async (id) => {
        try {
            const listing = await InternalListingModel.findById(id);
            if (!listing) {
                throw new ErrorHandler('Listing not found', 404);
            }
            return listing;
        } catch (error) {
            throw new ErrorHandler('Error reading listing', 500);
        }
    },
    findListingsByUserId: async (userId) => {
        try {
            const listings = await InternalListingModel.find({ createdBy: userId });
            if (!listings.length) {
                throw new ErrorHandler('No listings found for this user', 404);
            }
            return listings;
        } catch (error) {
            throw new ErrorHandler('Error fetching listings by user ID', 500);
        }
    },
    // Update a listing by ID
    updateListing: async (id, updateData) => {
        try {
            const updatedListing = await InternalListingModel.findByIdAndUpdate(
                id,
                { $set: updateData }, // Use the $set operator to update fields
                { new: true }
            );
            if (!updatedListing) {
                throw new ErrorHandler('Listing not found', 404);
            }
            return updatedListing;
        } catch (error) {
            throw new ErrorHandler('Error updating listing', 500);
        }
    },

    // Delete a listing by ID
    deleteListing: async (id) => {
        try {
            const deletedListing = await InternalListingModel.findByIdAndDelete(id);
            if (!deletedListing) {
                throw new ErrorHandler('Listing not found', 404);
            }
            return deletedListing;
        } catch (error) {
            throw new ErrorHandler('Error deleting listing', 500);
        }
    },

    // Find listings with various filters and sorting
    findListings: async (filters) => {
        try {
            try {
                const query = InternalListingModel.find();

                // Filter by title
                if (filters.title) {
                    query.where('title').equals(new RegExp(filters.title, 'i'));
                }

                // Filter by listingStatus
                if (filters.listingStatus) {
                    query.where('listingStatus').equals(filters.listingStatus);
                }

                // Filter by listingDate range
                if (filters.listingDate) {
                    // return listings that become available on or after the specified date.
                    query.where('listingDate').gte(filters.listingDate);
                }

                // Sort by listingDate
                if (filters.sortByListingDate) {
                    query.sort({ listingDate: filters.sortByListingDate });
                }

                // Filter by propertyType
                if (filters.propertyType) {
                    query.where('propertyType').equals(filters.propertyType);
                }

                // Filter by yearBuilt
                if (filters.yearBuilt) {
                    query.where('yearBuilt').equals(filters.yearBuilt);
                }

                // Filter by price range
                if (filters.priceMin || filters.priceMax) {
                    query.where('price').gte(filters.priceMin).lte(filters.priceMax);
                }

                // Sort by price
                if (filters.sortByPrice) {
                    query.sort({ price: filters.sortByPrice });
                }

                // Filter by location (city and state)
                if (filters.city || filters.state) {
                    query
                        .where('location')
                        .elemMatch({ city: filters.city, state: filters.state });
                }

                // Filter by zipCode
                if (filters.zipCode) {
                    query.where('location.zipCode').equals(filters.zipCode);
                }

                // Filter by tags
                if (filters.tags && filters.tags.length > 0) {
                    query.where('metadata.tags').all(filters.tags);
                }

                return await query.exec();
            } catch (error) {
                throw error;
            }
        } catch (error) {
            throw new ErrorHandler('Error finding listings', 500);
        }
    },
};

export default InternalListingDao;
