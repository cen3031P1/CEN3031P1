/*
    This file will create the schema for the database and include static functions for auth
    
    Exported Functions:
    login - this function will be called in the controller when a user tries to log in.
        It will check if the username exists and if the password is correct. If both are true, it will return the user.
        Using bcrypt to compare the password with the hashed password in the database.

    signup - this function will be called in the controller when a user tries to sign up.
        It will check if the username already exists, if the username and password are provided, if the username is alphanumeric, and if the password is strong enough. 
        If all checks pass, it will create a new user with the hashed password using bcrypt and return the user.

    User - this is the model

    Imports:
    mongoose - this is the library used to interact with the MongoDB database.
    bcrypt - this is the library used to hash passwords and compare them for authentication.
    validator - this is the library used to validate the username and password for sign up. (just does quick checks, I could make these functions myself but no need)
*/


import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';


//user schema... self explanatory. to be accepted into database the user must have
//username, password, points, gym location, streak, best streak, and friends list.
//when the user signs up they will be given 0 points, gym location of (0, 0), streak of 0, best streak of 0, and an empty friends list.
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
    goal: {
        type: Number,
        required: true,
        default: 0
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
    visibleOnLeaderboard: {
        type: Boolean,
        required: true,
        default: true,
    },
    friends: {
        type: [String],
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
        default: "user",
    }, 
    bio: {
        type: String,
        required: false,
        default: 'Bio Not Set',
    },
    currLat: {
        type: Number,
        required: true,
    },
    currLon: {
        type: Number,
        required: true,
    }

}, {collection: "users"})

//keep all usernames unique and indexed for searching
userSchema.index({userName: 1}, {unique: true})

//static function for loggin in a user. does simple checks
//finds if user is in database using username, then compares password with bcrypt to ensure its the right user
userSchema.statics.login = async function(userName, password) {

    if(!userName || !password){
        const err = new Error("Username and password must be provided")
        err.code = "MISSING_FIELDS"
        throw err
    }

    const user = await this.findOne({userName});

    if(!user){
        const err = new Error("Incorrect username")
        err.code = "WRONG_USERNAME"
        throw err;
    }

    const check = await bcrypt.compare(password, user.password);
    if(!check){
        const err = new Error("Incorrect password")
        err.code = "WRONG_PASSWORD"
        throw err;
    }

    return user;
}


//static function for signing up a user. does checks to ensure username is unique, username and password are provided, username is alphanumeric, and password is strong enough.
//if all checks pass, it creates a new user with the hashed password using bcrypt and returns the user.
userSchema.statics.signup = async function(userName, password) {
    
    const find = await this.findOne({userName});
    if(find){
        const err = new Error("Username already exists");
        err.code = "USER_EXISTS"
        throw err
    }

    if(!userName || !password){
        const err = new Error("Username and password must be provided");
        err.code = "MISSING_FIELDS"
        throw err
    }

    if(!validator.isAlphanumeric(userName)){
        const err = new Error("Username must be alphanumeric");
        err.code = "BAD_USERNAME"
        throw err
    }

    //username needs uppercase, lowercase, number, and symbol, and be at least 8 characters long
    if(!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })){
        const err = new Error("Password not strong enough");;
        err.code = "BAD_PASSWORD"
        throw err
    }
  
    //salt is provided by bcrypt. It happens before hashing and adds random string of text to password.
    //higher salt == more characters
    const salt = await bcrypt.genSalt(10);

    //hash the passwords using the salt
    const hash = await bcrypt.hash(password, salt);

    //adds user to db
    const user = await this.create({userName, password: hash, points: 0, gymLat: 0, gymLon: 0, streak: 0, bestStreak: 0, goal: 0, visibleOnLeaderboard: true, friends: [], role: "user", bio: "Bio Not Set"});

    return user;
}
userSchema.statics.saveGymLocation = async function(userName, gymLat, gymLon) {

    if (!userName) {
        const err = new Error("Username must be provided");
        err.code = "MISSING_FIELDS";
        throw err;
    }

    if (gymLat === undefined || gymLon === undefined) {
        const err = new Error("Latitude and longitude must be provided");
        err.code = "MISSING_FIELDS";
        throw err;
    }

    const user = await this.findOneAndUpdate(
        { userName },
        { gymLat, gymLon },
        { new: true }
    );

    if (!user) {
        const err = new Error("User not found");
        err.code = "USER_NOT_FOUND";
        throw err;
    }

    return user;
}

userSchema.statics.saveCurrLocation = async function(userName, currLat, currLon) {

    if (!userName) {
        const err = new Error("Username must be provided");
        err.code = "MISSING_FIELDS";
        throw err;
    }

    if (currLat === undefined || currLon === undefined) {
        const err = new Error("Latitude and longitude must be provided");
        err.code = "MISSING_FIELDS";
        throw err;
    }

    const user = await this.findOneAndUpdate(
        { userName },
        { currLat, currLon },
        { new: true }
    );

    if (!user) {
        const err = new Error("User not found");
        err.code = "USER_NOT_FOUND";
        throw err;
    }

    return user;
}

const User = mongoose.model('User', userSchema);

export default User;