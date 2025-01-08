import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Lecture title is required'],
            trim: true,
            maxLength: [100, 'Lecture title cannot exceed 100 character'],
        },

        description: {
            type: String,
            trim: true,
            maxLength: [500, 'Lecture description cannot exceed 500 character'],
        },

        videoUrl: {
            type: String,
            required: [true, 'Video url is required'],
        },

        duration: {
            type: Number,
            default: 0,
        },

        publicId: {
            type: String,
            required: [true, 'publicId for video management'],
        },

        isPreview: {
            type: Boolean,
            default: false,
        },

        order: {
            type: Number,
            required: [true, 'Lecture order is required'],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

lectureSchema.pre('save', function () {
    this.duration = Math.round(this.duration * 100) / 100;
});

export const Lecture = mongoose.model('Lecture', lectureSchema);
