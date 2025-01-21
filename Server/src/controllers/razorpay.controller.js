import { Course } from '../models/course.model.js';
import { CoursePurchase } from '../models/coursePurchase.model.js';
import Razorpay from 'razorpay';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = asyncHandler(async (req, res) => {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError('Course not found', 404);
    }

    const newPurchase = new CoursePurchase({
        course: courseId,
        user: userId,
        amount: course.price,
        status: 'pending',
    });

    const options = {
        amount: course.price,
        currency: 'INR',
        receipt: `course_${courseId}`,
        notes: {
            courseId: courseId,
            userId: userId,
        },
    };

    const order = await razorpay.orders.create(options);
    console.log(order);

    newPurchase.paymentId = order.id;
    await newPurchase.save();

    res.status(200).json({
        success: true,
        order,
        course: {
            name: course.title,
            description: course.description,
        },
    });
});

export const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        throw new ApiError('Payment verification failed', 400);
    }

    const purchase = await await CoursePurchase.findOne({
        paymentId: razorpay_payment_id,
    });

    if (!purchase) {
        throw new ApiError('Purchase record not found', 404);
    }

    purchase.status = 'completed';
    await purchase.save();

    res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        courseId: purchase.course, // might be courseId instead of course
    });
});
