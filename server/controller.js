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
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '2d'})
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
        res.status(400).json({msg: "Couldn't log in user", error: error.message});
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
        console.log("Shoudl be added to db?")
        const token = createToken(user._id);

        res.status(201).json({username: userName,  token});

    } catch (error){
        console.error("Error signing up user...", error);
        res.status(400).json({msg: "Couldn't sign up user", code: error.code});
    }
}