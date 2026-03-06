import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
//maybe also include bio?
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        required: false
    },
    points: {
        type: Number,
        required: true,
    },
    gymLat: {
        type: Number,
        required: true,
    },
    gymLon: {
        type: Number,
        required: true,
    },
    streak: {
        type: Number,
        required: true,
    },
    bestStreak: {
        type: Number,
        required: true,
    },
    friends: {
        type: [String],
        required: true,
    }
}, {collection: "users"})

userSchema.index({userName: 1}, {unique: true})

const User = mongoose.model('User', userSchema);

export default User;