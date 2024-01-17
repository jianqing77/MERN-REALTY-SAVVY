import ErrorHandler from './ErrorHandler';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(new ErrorHandler('Unauthorized.', 404));
    }
};
