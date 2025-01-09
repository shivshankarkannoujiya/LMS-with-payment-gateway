import jwt from 'jsonwebtoken';

export const generateToken = (res, user, message) => {
    const token = jwt.sign(
        {
            userId: user._id,
        },
        process.env.SECRET_KEY,
        {
            expiresIn: process.env.TOKEN_EXPIRY,
        }
    );

    const Options = {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    };

    return res.status(200).cookie('token', token, Options).json({
        success: true,
        message,
        user,
        token,
    });
};
