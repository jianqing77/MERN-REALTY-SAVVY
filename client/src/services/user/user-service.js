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
export const addLikedInternalListing = async (userId, listingId) => {
    try {
        const response = await api.post(`${USER_URL}/${userId}/likedInternalListing`, {
            listingId,
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
export const removeLikedInternalListing = async (userId, listingId) => {
    try {
        const response = await api.delete(
            `${USER_URL}/${userId}/likedInternalListing/${listingId}`
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
