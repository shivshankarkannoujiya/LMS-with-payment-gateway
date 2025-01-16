import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

export const isAuthenticated = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        throw new ApiError('You are not logged In', 401);
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.id = decodedToken.userId;
        next();
    } catch (error) {
        throw new ApiError('JWT token error', 401);
    }
});
