import axios from 'axios';
const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL;

console.log('client side server api: ' + SERVER_API_URL);
const AUTH_URL = `${SERVER_API_URL}/auth`;

// configure axios to support cookies for passing credentials
const api = axios.create({ withCredentials: true });

export const signup = async ({ username, email, password }) => {
    const response = await api.post(`${AUTH_URL}/signup`, { username, email, password });
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
    // console.log('user data from auth service:' + user);
    const message = 'User successfully signed in';
    return {
        user: userSignedIn,
        message: message,
    };
};

export const signout = async () => {
    const response = await api.post(`${AUTH_URL}/signout`);
    return response.data;
};

// export const profile = async () => {
//     const response = await api.post(`${AUTH_URL}/signout`);
//     return response.data;
// };
