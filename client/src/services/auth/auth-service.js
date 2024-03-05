import axios from 'axios';
const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL;

console.log('client side server api: ' + SERVER_API_URL);
const AUTH_URL = `${SERVER_API_URL}/auth`;

// configure axios to support cookies for passing credentials
const api = axios.create({ withCredentials: true });

// pass in the info we want to send to the server
export const signup = async ({ userName, email, password }) => {
    const response = await api.post(`${AUTH_URL}/signup`, { userName, email, password });
    const createdUser = response.data;
    const message = 'User successfully created';
    return {
        user: createdUser,
        message: message,
    };
};

export const signIn = async ({ email, password }) => {
    const response = await api.post(`${AUTH_URL}/signin`, {
        email,
        password,
    });
    const userSignedIn = response.data;
    console.log('in auth service: userSignedIn: ' + userSignedIn);
    const message = 'User successfully signed in';
    return {
        user: userSignedIn,
        message: message,
    };
};

export const authGoogle = async (userData) => {
    // console.log('authGoogle is called in service: ' + JSON.stringify(userData));
    const response = await api.post(`${AUTH_URL}/authgoogle`, userData);
    const user = response.data;
    return {
        user: user,
        message: 'Success!',
    };
};

export const signout = async () => {
    try {
        const response = await axios.get(`${AUTH_URL}/signout`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error during sign out:', error);
        throw error;
    }
};
