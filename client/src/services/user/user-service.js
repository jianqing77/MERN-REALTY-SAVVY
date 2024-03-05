import axios from 'axios';

const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL;
const USER_URL = `${SERVER_API_URL}/user`;
// configure axios to support cookies for passing credentials
const api = axios.create({ withCredentials: true });

export const updateUserGeneral = async (userId, userUpdateData) => {
    const response = await api.put(
        `${USER_URL}/update-general/${userId}`,
        userUpdateData
    );
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
        const response = await api.put(
            `${USER_URL}/update-password/${userId}`,
            credentials
        );
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
    const response = await api.delete(`${USER_URL}/delete/${userId}`);
    const message = response.data;
    return {
        message: message,
    };
};
