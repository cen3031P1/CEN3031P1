import User from './models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


function createToken(userId) {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '2d'})
}


export async function login(req, res) {
    try{
        const {userName, password} = req.body;

        const user = await User.login(userName, password);

        const token = createToken(user._id);

        res.status(201).json({username: userName, token});
    } catch (error){
        res.status(400).json({msg: "Couldn't log in user", error: error.message});
    }
}

export async function signUp(req, res) {
    try{
        const {userName, password} = req.body;

        const user = await User.signup(userName, password);

        const token = createToken(user._id);

        res.status(201).json({username: userName,  token});

    } catch (error){
        console.error("Error signing up user...", error);
        res.status(400).json({msg: "Couldn't sign up user", error: error.message});
    }
}