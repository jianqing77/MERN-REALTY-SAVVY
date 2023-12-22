export const generateRandomPassword = () => {
    const generatedPassword = Math.random().toString(36).slice(-8);
    return generatedPassword;
};

export const googleUsernameConversion = (googleUsername) => {
    const convertedUsername =
        googleUsername.split(' ').join('').toLowerCase() +
        Math.random().toString(36).slice(-4);
    return convertedUsername;
};
