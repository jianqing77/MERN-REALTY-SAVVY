import axios from 'axios';
import dotenv from 'dotenv';
import catchAsync from '../utils/catchAsync.js';
import ErrorHandler from '../utils/ErrorHandler.js';

// Get the env variables
dotenv.config();
const APARTMENT_API_KEY = process.env.APARTMENT_API_KEY;

const mapApiDataToListingSchema = (listing) => {
    const formatRange = (min, max) => {
        if (min !== null && max !== null) {
            return `${min} - ${max}`;
        } else if (min !== null) {
            return `${min}+`;
        } else if (max !== null) {
            return `Up to ${max}`;
        } else {
            return 'Not provided';
        }
    };

    const imageUrls = listing.photos?.map((photo) => photo.href) || [];
    // If primary_photo exists and is not already in the photos array, prepend it
    if (listing.primary_photo?.href && !imageUrls.includes(listing.primary_photo.href)) {
        imageUrls.unshift(listing.primary_photo.href);
    }

    const price = listing.list_price
        ? `${listing.list_price}`
        : formatRange(listing.list_price_min, listing.list_price_max);

    // Handle pet policies with 'null' as 'unknown'
    const petsPolicy = listing.pet_policy
        ? {
              cats:
                  listing.pet_policy.cats === true
                      ? 'Allowed'
                      : listing.pet_policy.cats === false
                      ? 'Not allowed'
                      : 'Unknown',
              dogs:
                  listing.pet_policy.dogs === true
                      ? 'Allowed'
                      : listing.pet_policy.dogs === false
                      ? 'Not allowed'
                      : 'Unknown',
          }
        : {
              cats: 'Unknown',
              dogs: 'Unknown',
          };

    const baseSchema = {
        id: listing.property_id,
        title:
            listing.location && listing.location.address
                ? `${listing.location.address.line}, ${listing.location.address.city}`
                : 'N/A',
        listingType: listing.status,
        listingDate: listing.list_date,
        price: price,
        propertyType: listing.description && listing.description.type,
        location: {
            address: listing.location?.address?.line || 'N/A',
            city: listing.location?.address?.city || 'N/A',
            state: listing.location?.address?.state || 'N/A',
            zipCode: listing.location?.address?.postal_code || 'N/A',
        },
        features: {
            bedrooms: listing.description?.beds
                ? `${listing.description.beds}`
                : formatRange(
                      listing.description?.beds_min,
                      listing.description?.beds_max
                  ),
            bathrooms: listing.description?.baths
                ? `${listing.description.baths}`
                : formatRange(
                      listing.description?.baths_min,
                      listing.description?.baths_max
                  ),
            squareFootage: listing.description?.sqft
                ? `${listing.description.sqft}`
                : formatRange(
                      listing.description?.sqft_min,
                      listing.description?.sqft_max
                  ),
        },
        contactInfo: {
            agentCompany: listing.branding?.[0]?.name || 'N/A',
            agentName: listing.advertisers?.[0]?.name || 'N/A',
            email: listing.advertisers?.[0]?.email || 'N/A',
        },
        media: {
            imageUrls: imageUrls.length > 0 ? imageUrls : ['default-image.jpg'],
            refUrl: listing.href || 'N/A',
        },
        metadata: {},
    };

    if (listing.status === 'for_rent') {
        baseSchema.pet_policy = petsPolicy;
    }

    // if (listing.status === 'for_sale') {
    //     baseSchema.lastSoldDate = listing.home_age || 'Not provided';
    // }

    return baseSchema;
};

export const getLocationId = async (req, res, next) => {
    const location = req.query.location;

    if (!location) {
        return res.status(400).send('Location parameter is required');
    }

    const options = {
        method: 'GET',
        url: 'https://realty-us.p.rapidapi.com/properties/auto-complete',
        params: { input: location },
        headers: {
            'X-RapidAPI-Key': APARTMENT_API_KEY,
            'X-RapidAPI-Host': 'realty-us.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.request(options);
        if (
            response.data &&
            response.data.data &&
            response.data.data.autocomplete &&
            response.data.data.autocomplete.length > 0
        ) {
            req.locationId = response.data.data.autocomplete[0].id; // set location ID in request
            next(); // Proceed to next middleware (getRentalListings)
        } else {
            res.status(404).send('No valid location found');
        }
    } catch (error) {
        console.error('Error fetching location ID:', error);
        res.status(500).send('Error fetching location ID');
    }
};

export const getRentalListings = async (req, res) => {
    const {
        locationId,
        query: { page = 1, prices, homeSize, bedrooms, bathrooms, pets },
    } = req;

    const params = {
        location: locationId,
        resultsPerPage: 20,
        page,
    };

    const optionalParams = {
        prices,
        pets,
        bedrooms,
        bathrooms,
        homeSize: homeSize?.trim(),
    };

    // Add parameters only if they exist
    Object.keys(optionalParams).forEach((key) => {
        if (optionalParams[key]) {
            params[key] = optionalParams[key];
        }
    });

    const options = {
        method: 'GET',
        url: 'https://realty-us.p.rapidapi.com/properties/search-rent',
        params,
        headers: {
            'X-RapidAPI-Key': APARTMENT_API_KEY,
            'X-RapidAPI-Host': 'realty-us.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.request(options);
        const {
            data: { meta, data },
        } = response;
        const { currentPage, totalRecords, limit: resultsPerPage } = meta;
        const listings = data.results.map(mapApiDataToListingSchema);

        res.json({
            searchLocation: locationId,
            totalRecords,
            resultsPerPage,
            currentPage,
            listings,
        });
    } catch (error) {
        console.error('Error fetching rental properties:', error);
        res.status(500).send('Error fetching rental properties');
    }
};

export const getSaleListings = async (req, res) => {
    const {
        locationId,
        query: { page = 1, prices, homeSize, homeAge, bedrooms, bathrooms },
    } = req;

    const params = {
        location: locationId,
        resultsPerPage: 20,
        page,
    };

    const optionalParams = {
        prices,
        homeSize: homeSize?.trim(),
        homeAge: homeAge?.trim(),
        bedrooms,
        bathrooms,
    };

    Object.keys(optionalParams).forEach((key) => {
        if (optionalParams[key]) {
            params[key] = optionalParams[key];
        }
    });

    const options = {
        method: 'GET',
        url: 'https://realty-us.p.rapidapi.com/properties/search-buy',
        params,
        headers: {
            'X-RapidAPI-Key': APARTMENT_API_KEY,
            'X-RapidAPI-Host': 'realty-us.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.request(options);
        const currentPage = response.data.meta.currentPage;
        const totalRecords = response.data.meta.totalRecords;
        const resultsPerPage = response.data.meta.limit;
        const listings = response.data.data.results.map(mapApiDataToListingSchema);

        const result = {
            searchLocation: locationId,
            totalRecords: totalRecords,
            resultsPerPage: resultsPerPage,
            currentPage: currentPage,
            listings: listings,
        };

        res.json(result);
    } catch (error) {
        console.error('Error fetching sale properties:', error);
        res.status(500).send('Error fetching sale properties');
    }
};

export const getPropertyDetails = catchAsync(async (req, res) => {
    const propertyId = req.params.propertyId;

    if (!propertyId) {
        throw new ErrorHandler('Property ID is required', 400);
    }

    const options = {
        method: 'GET',
        url: `https://realty-us.p.rapidapi.com/properties/detail`,
        params: { propertyId },
        headers: {
            'X-RapidAPI-Key': APARTMENT_API_KEY,
            'X-RapidAPI-Host': 'realty-us.p.rapidapi.com',
        },
    };

    const response = await axios.request(options);
    if (response.data && response.data.data) {
        const propertyDetails = mapApiDataToListingSchema(response.data.data);
        res.json(propertyDetails);
    } else {
        throw new ErrorHandler('No details found for this property', 404);
    }
});
