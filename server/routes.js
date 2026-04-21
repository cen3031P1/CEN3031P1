/*
    This file defines the routes for the server.
    Any routes we create should be put here and then defined in ./controllers.js

    Exported Functions:
    router - this is the router that will be used in the server.js file to define the routes for the server.

    Imports:
    express

    signUp - see controller.js for more details

    login - see controller.js for more details


*/

import express from 'express';
import {
    signUp,
    login,
    addFriend,
    getFriends,
    removeFriend,
    getLeaderboard,
    getLeaderboardVisibility,
    setLeaderboardVisibility,
    uploadProfilePic,
    deleteAccount,
    fetchProfileData,
    getRole,
    makeAdmin,
    saveGymLocation,
    saveCurrLocation,
    getCurrLocation,
    getGymLocation,
    setGoal,
    setBio,
    setStreak,
    // getPoints,
    // getStreak,
    // getBestStreak,
    getAllUsers,
    deleteUserByName
} from './controller.js';
import requireAuth from './middleware/requireAuth.js';
import adminAuth from './middleware/adminAuth.js';

const router = express.Router();

router.get('/', (req, res) => {
    console.log("Hey youre on the home page!")
    res.send("hi");
})


router.post('/login', login);

router.post('/signup', signUp);

router.use(requireAuth)
router.get('/gym-location', getGymLocation)
router.post('/curr-location', saveCurrLocation)
router.get('/user-location', getCurrLocation);
router.post('/locations', saveGymLocation);
// Add friends
router.post('/addfriend', addFriend);

// Get friends list
router.get('/friends/:userName', getFriends);

// Remove friends
router.delete('/removefriend', removeFriend);

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

// Get current user leaderboard visibility
router.get('/leaderboard/visibility/:userName', getLeaderboardVisibility);

// Update current user leaderboard visibility
router.patch('/leaderboard/visibility', setLeaderboardVisibility);

// Upload profile picture
router.patch('/user/:userName/profile-pic', uploadProfilePic);

// Delete account
router.delete('/user/:userName', deleteAccount);

//gets profile pic, points, streak, and best streak
router.get('/user/:userName/fetchProfileData', fetchProfileData);

//get user role (admin or user)
router.get('/user/:userName/getRole', getRole);

//set goal
router.patch('/user/:userName/setGoal', setGoal);

//set bio
router.patch('/user/:userName/setBio', setBio);

router.use(adminAuth)

router.get('/allUsers', getAllUsers);

router.delete('/delUser/:userName', deleteUserByName)

//make another user an admin
router.patch('/user/makeAdmin', makeAdmin);

//set streak
router.patch('/user/:userName/setStreak', setStreak);

export default router;