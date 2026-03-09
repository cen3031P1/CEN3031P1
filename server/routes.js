import express from 'express';
import { signUp, login } from './controller.js';

const router = express.Router();

router.get('/', (req, res) => {
    console.log("Hey youre on the home page!")
    res.send("hi");
})

router.post('/login', login);

router.post('/signup', signUp);

export default router;