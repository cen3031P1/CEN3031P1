/*
This file will hold the controller functions for the routes. 

Exported Functions:
login

signUp

Imports:
User - this is the user model from ./models/user.js. 
    This is used to instruct the database how to create a user and also has
    the static functions for logging in and signup

JWT - this is the jsonwebtoken library. 
    This token lets the user stay logged in even after they leave the website.
    Created when sign up or login


*/

import User from './models/user.js';
import jwt from 'jsonwebtoken';



//function that creates the JWT token using the user's id
//and a secret key. Token expires in 2 days.
function createToken(userId) {
    return jwt.sign({_id: userId}, process.env.JWT_SECRET, {expiresIn: '2d'})
}


//Handle user login. Takes in username and password 
//if user exists itll create a JWT token so the user stays logged in
//Calls static login function in ./models/user.js.
export async function login(req, res) {
    try{
        const {userName, password} = req.body;

        const user = await User.login(userName, password);

        const token = createToken(user._id);

        res.status(200).json({username: userName, token});
    } catch (error){
        res.status(400).json({msg: "Couldn't log in user", code: error.code});
    }
}


//Handle user sign up. Takes in username and password.
//Creates a JWT token so user stays logged in.
//Calls static signup function in ./models/user.js.
export async function signUp(req, res) {
    console.log("Attempting sign up")
    try{
        const {userName, password} = req.body;

        const user = await User.signup(userName, password);
        console.log("Should be added to db?")
        const token = createToken(user._id);

        res.status(201).json({username: userName,  token, visibleOnLeaderboard: user.visibleOnLeaderboard !== false});

    } catch (error){
        console.error("Error signing up user...", error);
        res.status(400).json({msg: "Couldn't sign up user", code: error.code});
    }
}

// Handle getting friends. Takes in username and returns list of friends.
export async function getFriends(req, res) {
    try {
        const {userName} = req.params;
        const user = await User.findOne({userName});
        if (!user) {
            return res.status(404).json({msg: "User not found in DB", code: "USER_NOT_FOUND"});
        }
        res.status(200).json({friends: user.friends});
    } catch (error) {
        console.error("Error getting friends...", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}


// Handle adding friends. Takes in username and friend name.
// Checks if both users exist, checks if they are already friends, and then adds friend to user's friend list.
export async function addFriend(req, res) {
    try {
        const {userName, friendUsername} = req.body;

        if (!userName || !friendUsername) {
            return res.status(400).json({msg: "Username and friend username must be provided", code: "MISSING_FIELDS"});
        }

        if (userName === friendUsername) {
            return res.status(400).json({msg: "You cannot add yourself as a friend", code: "CANNOT_ADD_SELF"});
        }

        const friend = await User.findOne({userName: friendUsername});
        if (!friend) {
            return res.status(404).json({msg: "Friend not found in DB", code: "FRIEND_NOT_FOUND"});
        }

        const user = await User.findOne({userName});
        if (!user) {
            return res.status(404).json({msg: "User not found in DB", code: "USER_NOT_FOUND"});
        }

        if (user.friends.includes(friendUsername)) {
            return res.status(400).json({msg: "You are already friends with this user", code: "FRIEND_ALREADY_ADDED"});
        }

        user.friends.push(friendUsername);
        await user.save();

        res.status(200).json({msg: "Friend added successfully", code: "FRIEND_ADDED"});

    } catch (error) {
        console.error("Error adding friend...", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}

// Remove friend function.
// Takes in username and friend name.
// Checks if both users exist and if they are friends, and then removes friend from user's friend list.
export async function removeFriend(req, res) {
    try {
        const {userName, friendUsername} = req.query;

        if (!userName || !friendUsername) {
            return res.status(400).json({msg: "Username and friend username must be provided", code: "MISSING_FIELDS"});
        }

        const user = await User.findOne({userName});
        if (!user) {
            return res.status(404).json({msg: "User not found in DB", code: "USER_NOT_FOUND"});
        }

        if (!user.friends.includes(friendUsername)) {
            return res.status(400).json({msg: "You are not friends with this user", code: "NOT_FRIENDS"});
        }

        user.friends = user.friends.filter(friend => friend !== friendUsername);
        await user.save();

        res.status(200).json({msg: "Friend removed successfully", code: "FRIEND_REMOVED"});

    } catch (error) {
        console.error("Error removing friend: ", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}


// Get leaderboard function.
// Takes in query parameter for sorting (points or bestStreak) and returns top 50 users sorted by that parameter.
export async function getLeaderboard(req, res) {
    try {
        const sortBy = req.query.sortBy || 'points'; // Default to sorting by points
        const validFields = ['points', 'bestStreak'];
        if (!validFields.includes(sortBy)) {
            return res.status(400).json({msg: "Invalid sort field", code: "INVALID_SORT_FIELD"});
        }
        const users = await User.find({visibleOnLeaderboard: {$ne: false}}, `userName ${sortBy}`).sort({ [sortBy]: -1 }).limit(10);
        console.log(users)
        res.status(200).json({leaderboard: users});
    } catch (error) {
        console.error("Error getting leaderboard: ", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}

// Get a user's leaderboard visibility.
export async function getLeaderboardVisibility(req, res) {
    try {
        const {userName} = req.params;

        if (!userName) {
            return res.status(400).json({msg: "Username must be provided", code: "MISSING_FIELDS"});
        }

        const user = await User.findOne({userName}, 'visibleOnLeaderboard');
        if (!user) {
            return res.status(404).json({msg: "User not found in DB", code: "USER_NOT_FOUND"});
        }

        res.status(200).json({visibleOnLeaderboard: user.visibleOnLeaderboard});
    } catch (error) {
        console.error("Error getting leaderboard visibility: ", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}

// Update a user's leaderboard visibility.
export async function setLeaderboardVisibility(req, res) {
    try {
        const {userName, visibleOnLeaderboard} = req.body;

        if (!userName || typeof visibleOnLeaderboard !== 'boolean') {
            return res.status(400).json({msg: "Username and visibility boolean must be provided", code: "MISSING_FIELDS"});
        }

        const user = await User.findOne({userName});
        if (!user) {
            return res.status(404).json({msg: "User not found in DB", code: "USER_NOT_FOUND"});
        }

        user.visibleOnLeaderboard = visibleOnLeaderboard;
        await user.save();

        res.status(200).json({
            msg: "Leaderboard visibility updated",
            code: "LEADERBOARD_VISIBILITY_UPDATED",
            visibleOnLeaderboard: user.visibleOnLeaderboard,
        });
    } catch (error) {
        console.error("Error updating leaderboard visibility: ", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}



// Handle uploading profile picture. Takes in username and image data (base64 string).
// Saves image to server and updates user's profilePic field with image URL.
export async function uploadProfilePic(req, res) {
    const {userName} = req.params;
    const {profilePic} = req.body;

    try {
        const user = await User.findOneAndUpdate(
            {userName},
            {profilePic},
            {new: true}
        )

        if (!user) {
            return res.status(404).json({msg: "User not found in DB", code: "USER_NOT_FOUND"});
        }

        res.status(200).json({msg: "Profile picture updated successfully", code: "PROFILE_PIC_UPDATED", profilePic: user.profilePic});
    } catch (error) {
        console.error("Error uploading profile picture: ", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}

// Delete account by username and remove this user from every friend list.
export async function deleteAccount(req, res) {
    try {
        const {userName} = req.params;
        const password = req.body?.password || req.query?.password;

        if (!userName || !password) {
            return res.status(400).json({msg: "Username and password must be provided", code: "MISSING_FIELDS"});
        }

        // Verify the user's password before allowing permanent deletion.
        await User.login(userName, password);

        const deletedUser = await User.findOneAndDelete({userName});

        if (!deletedUser) {
            return res.status(404).json({msg: "User not found in DB", code: "USER_NOT_FOUND"});
        }

        await User.updateMany(
            {friends: userName},
            {$pull: {friends: userName}}
        );

        res.status(200).json({msg: "Account deleted successfully", code: "ACCOUNT_DELETED"});
    } catch (error) {
        if (error?.code === 'WRONG_PASSWORD' || error?.code === 'WRONG_USERNAME') {
            return res.status(200).json({msg: "Invalid credentials", code: error.code});
        }
        console.error("Error deleting account: ", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}

export async function fetchProfileData(req, res) {
    try {
        const {userName} = req.params;
        const user = await User.findOne({userName});
        
        if (!user) {
            return res.status(404).json({msg: "User not found", code: "USER_NOT_FOUND"});
        }

        res.status(200).json({msg: "Profile data retrieved successfully", code: "PROFILE_DATA_RETRIEVED",profilePic: user.profilePic, goal: user.goal, streak: user.streak, bestStreak: user.bestStreak, bio: user.bio});
    } catch (error) {
        console.error("Error fetching profile data: ", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}

export async function getRole(req, res) {
    try {
        const {userName} = req.params;
        const user = await User.findOne({userName});
        
        if (!user) {
            return res.status(404).json({msg: "User not found", code: "USER_NOT_FOUND"});
        }

        res.status(200).json({msg: "Role retrieved successfully", code: "ROLE_RETRIEVED", role: user.role});
    } catch (error) {
        console.error("Error fetching user role: ", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}

export async function makeAdmin(req, res) {
    try {
        const {userName,otherUser} = req.body;
        const user = await User.findOne({userName: otherUser}); 

        if (!user) {
            return res.status(404).json({msg: "User not found", code: "USER_NOT_FOUND"});
        }

        if (otherUser === userName) {
            return res.status(400).json({msg: "You cannot change your own role", code: "CANNOT_MODIFY_SELF"});
        }

        if (user.role === "admin") {
            return res.status(400).json({msg: "User is already an admin", code: "USER_ALREADY_ADMIN"});
        }
        
        user.role = "admin";
        await user.save();
        
        res.status(200).json({msg: "Role updated successfully", code: "ROLE_UPDATED", role: user.role});
    } catch (error) {
        console.error("Error updating user role: ", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}

export async function setGoal(req, res) {
    try {
        const {userName} = req.params;
        const {goal} = req.body;

        const user = await User.findOne({userName});
        
        if (!user) {
            return res.status(404).json({msg: "User not found", code: "USER_NOT_FOUND"});
        }

        if (goal > 999999) {
            return res.status(400).json({msg: "Goal must be less than 999999", code: "GOAL_TOO_HIGH"});
        }

        user.goal = goal;
        await user.save();

        return res.status(200).json({msg: "Goal set successfully", code: "GOAL_SET"});
    }
    catch (error) {
        console.error("Error setting goal: ", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}

export async function setBio(req, res) {
    try {
        const {userName} = req.params;
        const {bio} = req.body;
        const user = await User.findOne({userName});

        if (!user) {
            return res.status(404).json({msg: "User not found", code: "USER_NOT_FOUND"});
        }

        if (bio.length > 150) {
            return res.status(400).json({msg: "Bio must be less than 150 characters", code: "BIO_TOO_LONG"});
        }

        user.bio = bio;
        await user.save();

        return res.status(200).json({msg: "Bio set successfully", code: "BIO_SET"});
    }
    catch (error) {
        console.error("Error setting bio: ", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}

export async function setStreak(req, res) {
    console.log('SET STREAK CONTROLLER HIT');
    try {
        const {userName} = req.params;
        const {streak} = req.body;
        const user = await User.findOne({userName});
        
        if (!user) {
            return res.status(404).json({msg: "User not found", code: "USER_NOT_FOUND"});
        }

        if (streak > 9999) {
            return res.status(400).json({msg: "Streak must be less than 9999", code: "STREAK_TOO_HIGH"});
        }

        user.streak = streak;
        if (user.bestStreak < streak){
            user.bestStreak = streak;
        }
        await user.save();

        return res.status(200).json({msg: "Streak set successfully", code: "STREAK_SET"});
    }
    catch (error) {
        console.error("Error setting streak: ", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}

export async function getAllUsers(req, res){
    try{
        const allUsers = await User.find({})
        return allUsers
    } catch (err){
        console.error("Error returning all users", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"})
    }
}

export async function deleteUserByName(req, res){
    try{
        const {username} = req.params

        const deleted = await User.findOneAndDelete({username})

        if(!deleted){
            return res.status(404).json({msg: "User not found in DB", code: "USER_NOT_FOUND"})
        }

        await User.updateMany(
            {friends: userName},
            {$pull: {friends: userName}}
        );

        res.status(200).json({msg: "User deleted", code: "ACCOUNT_DELETED"})
    } catch (err) {
        console.error("Error deleting user", err)
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }
}

export async function saveGymLocation(req, res){
    console.log("attempting to save location")
    const { userName, latitude, longitude } = req.body;

    try {
        const user = await User.saveGymLocation(userName, latitude, longitude);
        res.status(200).json({ message: "Gym location saved", user });
        console.log("location saved")
    } catch (err) {
        res.status(400).json({ error: err.message, code: err.code });
        console.log("location not saved:", err, err.code)
    }
}

export async function saveCurrLocation(req, res){
    const { userName, latitude, longitude } = req.body;

    try {
        const user = await User.saveCurrLocation(userName, latitude, longitude);
        res.status(200).json({ message: "Current location saved", user });
        console.log("location saved")
    } catch (err) {
        res.status(400).json({ error: err.message, code: err.code });
        console.log("location not saved:", err, err.code)
    }
}

export async function getCurrLocation(req, res){
    try{

        const {userName} = req.body
        const user = await User.findOne({userName})
        if (!user) {
            return res.status(404).json({msg: "User not found in DB", code: "USER_NOT_FOUND"});
        }
                res.status(200).json({latitude: user.currLat, longitude: user.currLon});
    } catch(error){
        console.error("Error getting current location...", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }

}

export async function getGymLocation(req, res){
    try{

        const {username} = req.params
        const user = await User.findOne({username})
        if (!user) {
            return res.status(404).json({msg: "User not found in DB", code: "USER_NOT_FOUND"});
        }
                res.status(200).json({latitude: user.gymLat, longitude: user.gymLon});
    } catch(error){
        console.error("Error getting gym location...", error);
        res.status(500).json({msg: "Internal server error", code: "INTERNAL_SERVER_ERROR"});
    }

}
