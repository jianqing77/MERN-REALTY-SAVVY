import axios from 'axios';

const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL;
const USER_URL = `${SERVER_API_URL}/user`;
// configure axios to support cookies for passing credentials
const api = axios.create({ withCredentials: true });

export const fetchUserProfile = async () => {
    try {
        const response = await api.get(`${USER_URL}/profile`);
        const userProfile = response.data;
        return {
            user: userProfile,
            message: 'Profile fetched successfully!',
        };
    } catch (error) {
        // Handle errors and throw a descriptive error
        throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
};

export const updateUserGeneral = async (userId, userUpdateData) => {
    const response = await api.put(`${USER_URL}/${userId}/general`, userUpdateData);
    const updatedUser = response.data;
    const message = 'Successfully updated!';
    return {
        user: updatedUser,
        message: message,
    };
};

export const updateUserPassword = async (userId, credentials) => {
    console.log(
        'client side service update user password is called',
        userId,
        credentials
    );
    try {
        const response = await api.put(`${USER_URL}/${userId}/password`, credentials);
        const updatedUser = response.data.user;
        const message = response.data.message;
        return {
            user: updatedUser,
            message: message,
        };
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    const response = await api.delete(`${USER_URL}/${userId}`);
    const message = response.data;
    return {
        message: message,
    };
};

// Add a liked internal listing for a specific user by ID
export const addLikedInternalListing = async (userId, propertyID) => {
    try {
        const response = await api.post(`${USER_URL}/${userId}/likedInternalListing`, {
            propertyID,
        });
        const updatedUser = response.data;
        return {
            user: updatedUser,
            message: 'added a new like of user created internal listing',
        };
    } catch (error) {
        console.error('Error adding liked internal listing:', error);
        throw error;
    }
};

// Remove a liked internal listing for a specific user by ID
export const removeLikedInternalListing = async (userId, propertyID) => {
    try {
        const response = await api.delete(
            `${USER_URL}/${userId}/likedInternalListing/${propertyID}`
        );
        const updatedUser = response.data;
        return {
            user: updatedUser,
            message: 'removed a like of user created internal listing',
        };
    } catch (error) {
        console.error('Error removing liked internal listing:', error);
        throw error;
    }
};

// Add a liked external listing for a specific user by ID
export const addLikedExternalListing = async (userId, propertyID) => {
    try {
        const response = await api.post(`${USER_URL}/${userId}/likedExternalListing`, {
            propertyID,
        });
        const updatedUser = response.data;
        return {
            user: updatedUser,
            message: 'added a like of public external internal listing',
        };
    } catch (error) {
        console.error('Error adding liked external listing:', error);
        throw error;
    }
};

// Remove a liked external listing for a specific user by ID
export const removeLikedExternalListing = async (userId, propertyID) => {
    try {
        const response = await api.delete(
            `${USER_URL}/${userId}/likedExternalListing/${propertyID}`
        );
        const updatedUser = response.data;
        return {
            user: updatedUser,
            message: 'removed a like of public external internal listing',
        };
    } catch (error) {
        console.error('Error removing liked external listing:', error);
        throw error;
    }
};

// Fetch details of all properties a user has liked
export const fetchLikedExternalListings = async (userId) => {
    try {
        // First, get the list of liked external listings
        const likedPropertiesResponse = await api.get(
            `${USER_URL}/${userId}/likedExternalListings`
        );
        const likedExternalListings = likedPropertiesResponse.data.likedExternalListings;

        // Use Promise.all to fetch details for each property concurrently
        const propertyDetailsPromises = likedExternalListings.map((listing) =>
            axios
                .get(
                    `${SERVER_API_URL}/apartments/property/${listing.propertyID.toString()}`
                )
                .then((response) => ({
                    ...response.data,
                    likedAt: listing.likedAt, // Include the likedAt timestamp from the original listing
                }))
        );

        // Resolve all promises and collect the property details
        const propertyDetails = await Promise.all(propertyDetailsPromises);

        // Return the collected property details
        return {
            likedExternalListingsDetails: propertyDetails,
            message: 'Property details fetched successfully!',
        };
    } catch (error) {
        console.error('Error fetching liked properties details:', error);
        throw new Error(
            error.response?.data?.message || 'Failed to fetch liked properties details'
        );
    }
};

// Fetch details of all properties a user has liked
export const fetchLikedInternalListings = async (userId) => {
    try {
        // First, get the list of liked external listings
        const likedPropertiesResponse = await api.get(
            `${USER_URL}/${userId}/likedInternalListings`
        );
        const likedInternalListings = likedPropertiesResponse.data.likedInternalListings;

        // console.log('SERVICE -- ' + JSON.stringify(likedInternalListings));
        // Use Promise.all to fetch details for each property concurrently
        const propertyDetailsPromises = likedInternalListings.map((listing) =>
            axios
                .get(`${SERVER_API_URL}/listing/${listing.propertyID}`)
                .then((response) => ({
                    ...response.data,
                    likedAt: listing.likedAt, // Include the likedAt timestamp from the original listing
                }))
        );

        // Resolve all promises and collect the property details
        const propertyDetails = await Promise.all(propertyDetailsPromises);

        console.log(propertyDetails);
        // Return the collected property details
        return {
            likedInternalListingsDetails: propertyDetails,
            message: 'Property details fetched successfully for the internal lsitings!',
        };
    } catch (error) {
        console.error('Error fetching liked properties details:', error);
        throw new Error(
            error.response?.data?.message || 'Failed to fetch liked properties details'
        );
    }
};
