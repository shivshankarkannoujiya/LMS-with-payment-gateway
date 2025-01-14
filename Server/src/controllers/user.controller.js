import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

export const createUserAccount = asyncHandler(async (req, res) => {
    const { name, email, password, role = 'student' } = req.body;

    if ([name, email, password].every((field) => field?.trim() === '')) {
        throw new ApiError('All fields are required', 401);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
        throw new ApiError('User already Exist', 400);
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role,
    });

    await user.updateLastActive();
    generateToken(res, user, 'Account Created successfully');
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError('All fields are required', 401);
    }

    const user = User.findOne({ email: email.toLowerCase() }).select(
        '+password'
    );
    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError('Invalid Email or Password', 401);
    }

    await user.updateLastActive();
    generateToken(res, user, `Welcome back ${user.name}`);
});


