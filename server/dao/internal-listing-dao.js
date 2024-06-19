import InternalListingModel from '../models/internal-listing-model.js';
import ErrorHandler from '../utils/ErrorHandler.js'; // Update with the actual path

async function searchListingsByQuery(locationQuery, filters) {
    try {
        // Define the location-based search criteria
        const locationConditions = {
            $or: [
                { 'location.address': { $regex: locationQuery, $options: 'i' } },
                { 'location.city': { $regex: locationQuery, $options: 'i' } },
                { 'location.state': { $regex: locationQuery, $options: 'i' } },
                { 'location.zipCode': { $regex: locationQuery, $options: 'i' } },
            ],
        };

        // Clean filters by removing empty objects
        const cleanedFilters = removeEmptyFilters(filters);

        console.log('Cleaned filters in the DAO:', JSON.stringify(cleanedFilters));

        // Initialize the search query with location conditions
        let searchQuery = {};

        // Check if cleaned filters are provided and are not empty
        if (Object.keys(cleanedFilters).length) {
            // Use $and to require both location match and cleaned filters match
            searchQuery.$and = [locationConditions, cleanedFilters];
        } else {
            // If no cleaned filters are provided, just use the location conditions
            searchQuery = locationConditions;
        }

        // Execute the search in the database
        const listings = await InternalListingModel.find(searchQuery);
        return listings;
    } catch (error) {
        throw new ErrorHandler(`Error fetching listings with specific filters`, 500);
    }
}

// Helper function to remove empty filters
function removeEmptyFilters(filters) {
    const cleanedFilters = {};
    for (const key in filters) {
        if (filters.hasOwnProperty(key) && !isEmpty(filters[key])) {
            cleanedFilters[key] = filters[key];
        }
    }
    console.log('Cleaned filters:', JSON.stringify(cleanedFilters)); // Additional logging for clarity
    return cleanedFilters;
}

// Function to check if an object is empty
function isEmpty(value) {
    if (value == null) return true; // Handles null and undefined
    if (typeof value === 'object') {
        if (Array.isArray(value)) return value.length === 0; // Checks if an array is empty
        return (
            Object.keys(value).length === 0 || // Checks if an object has no own properties
            (value.hasOwnProperty('$in') &&
                Array.isArray(value.$in) &&
                value.$in.length === 0)
        ); // Specific check for $in with empty array
    }
    return false; // Non-object and non-null values are not considered empty
}

function buildPetQuery(petPolicy) {
    return petPolicy ? { $in: petPolicy.split(',') } : undefined;
}

function buildPriceQuery(priceRange) {
    const query = {};
    if (priceRange.min) query.$gte = priceRange.min;
    if (priceRange.max) query.$lte = priceRange.max;
    return { price: query };
}

function buildSizeQuery(sizeRange) {
    const query = {};
    if (sizeRange.min) query.$gte = sizeRange.min;
    if (sizeRange.max) query.$lte = sizeRange.max;
    return { sqft: query };
}

function buildMinBedQuery(minValue) {
    const query = {};
    if (minValue) query.$gte = minValue;
    return { bedrooms: query };
}

function buildMinBathQuery(minValue) {
    const query = {};
    console.log(
        'buildMinBathQuery was called, the param was: ' + JSON.stringify(minValue)
    );
    if (minValue) query.$gte = minValue;
    console.log('the query end up to be: ' + JSON.stringify(query));
    return { bathrooms: query };
}

function buildHomeAgeQuery(homeAgeRange) {
    const query = {};
    console.log(
        'buildHomeAgeQuery was called, the param was: ' + JSON.stringify(homeAgeRange)
    );
    if (homeAgeRange.min) query.$gte = homeAgeRange.min;
    if (homeAgeRange.max) query.$lte = homeAgeRange.max;
    console.log('the query end up to be: ' + JSON.stringify(query));
    return { homeAge: query };
}

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
    findRentalListings: async (locationQuery, petPolicy, priceRange) => {
        const filters = {
            listingType: 'for-rent',
            ...(petPolicy && { petPolicy: buildPetQuery(petPolicy) }),
            ...buildPriceQuery(priceRange),
        };
        return searchListingsByQuery(locationQuery, filters);
    },
    findSaleListings: async (
        locationQuery,
        priceRange,
        sizeRange,
        homeAgeRange,
        minBeds,
        minBaths
    ) => {
        const filters = {
            listingType: 'for-sale',
            ...buildPriceQuery(priceRange),
            ...buildSizeQuery(sizeRange),
            ...buildHomeAgeQuery(homeAgeRange),
            ...buildMinBedQuery(minBeds),
            ...buildMinBathQuery(minBaths),
        };

        return searchListingsByQuery(locationQuery, filters);
    },
    findListingsByUserId: async (userId) => {
        try {
            const listings = await InternalListingModel.find({ createdBy: userId });
            // return {
            //     success: true,
            //     message: listings.length
            //         ? 'Listings found'
            //         : 'No listings found for this user',
            //     data: listings,
            // };
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
