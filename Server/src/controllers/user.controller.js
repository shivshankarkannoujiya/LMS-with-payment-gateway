import { validateSignup } from '../middlewares/validation.middleware.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteMediaFromCloudinary, uploadMedia } from '../utils/cloudinary.js';
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

export const logOutUser = asyncHandler(async (_, res) => {
    res.cookie('token', '', { maxAge: 0 }).status(200).json({
        success: true,
        message: 'Sign out successfully',
    });
});

export const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = User.findById(req.id).populate({
        path: 'enrolledCourses.course',
        select: 'title thumbnail description',
    });

    if (!user) {
        throw new ApiError('User not found', 404);
    }

    res.status(200).json({
        success: true,
        data: {
            ...user.toJSON(),
        },
        totalEnrolledCourses: user.totalEnrolledCourses,
    });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, email, bio } = req.body;
    const updateData = {
        name,
        email: email?.toLowerCase(),
        bio,
    };

    if (req.file) {
        const avatarResult = await uploadMedia(req.file.path);
        console.log(avatarResult); // for debugging
        updateData.avatar = avatarResult.secure_url;

        // delete old avatar
        const user = await User.findById(req.id);
        if (
            user.avatar &&
            user.avatar !==
                `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
        ) {
            await deleteMediaFromCloudinary(user.avatar);
        }
    }

    // update user and get updated documents
    const updatedUser = await User.findById(req.id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!updatedUser) {
        throw new ApiError('user not found', 404);
    }

    res.status(200).json({
        sucees: true,
        message: 'Profile updated successfully',
        data: updatedUser,
    });

});
