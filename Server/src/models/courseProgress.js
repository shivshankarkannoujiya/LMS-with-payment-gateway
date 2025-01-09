import mongoose from "mongoose";

const lectureProgessSchema = new mongoose.Schema({

    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
        required: [true, 'Lecture reference is required']
    },

    isCompleted: {
        type: Boolean,
        default: false
    },

    watchTime: {
        type: Number,
        default: 0
    },

    lastWatch: {
        type: Date,
        default: Date.now
    }
})


const coursePregressSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course reference is required']
    },

    isCompleted: {
        type: Boolean,
        default: false
    },

    completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    lectureProgess: [lectureProgessSchema],
    lastAccess: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


// update lastAccess
coursePregressSchema.methods.updateLastAccessed = function () {
    this.lastAccess = Date.now();
    return this.save({ validateBeforeSave: true });
}


// Calculate course Completion
coursePregressSchema.pre('save', function (next) {
    
})


export const CoursePregress = mongoose.model('CoursePregress', coursePregressSchema);

