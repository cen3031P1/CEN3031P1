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
import { signUp, login, addFriend, getFriends, removeFriend} from './controller.js';
import { get } from 'mongoose';

const router = express.Router();

router.get('/', (req, res) => {
    console.log("Hey youre on the home page!")
    res.send("hi");
})

router.post('/login', login);

router.post('/signup', signUp);

// Add friends
router.post('/addfriend', addFriend);

// Get friends list
router.get('/friends/:userName', getFriends);

// Remove friends
router.delete('/removefriend', removeFriend);

export default router;