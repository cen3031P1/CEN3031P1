import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

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

userSchema.statics.login = async function(userName, password) {

    if(!userName || !password){
        throw Error("Username and password must be provided");
    }
    
    const user = await User.findOne({userName});

    if(!user){
        throw Error("Incorrect username");
    }

    const check = await bcrypt.compare(password, user.password);
    if(!check){
        throw Error("Incorrect password");
    }

    return user;
}

userSchema.statics.signup = async function(userName, password) {
    
    const find = await this.findOne({userName});
    if(find){
        throw Error("Username already exists");
    }

    if(!userName || !password){
        throw Error("Username and password must be provided");
    }

    if(!validator.isAlphanumeric(userName)){
        throw Error("Username must be alphanumeric");
    }

    //username needs uppercase, lowercase, number, and symbol, and be at least 8 characters long
    if(!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })){
        throw Error("Password not strong enough");
    }

    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({userName, password: hash, points: 0, gymLat: 0, gymLon: 0, streak: 0, bestStreak: 0, friends: []});

    return user;
}

const User = mongoose.model('User', userSchema);

export default User;