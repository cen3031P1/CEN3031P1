import User from './models/user.js';

export async function signUp(req, res) {
    try{
        const {userName, password} = req.body;

        const user = await User.signup(userName, password);
        res.status(201).json({username: userName,  user});

    } catch (error){
        console.error("Error signing up user...", error);
        res.status(400).json({msg: "Couldn't sign up user"});
    }
}