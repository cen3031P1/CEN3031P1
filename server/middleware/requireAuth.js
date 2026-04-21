import jwt from 'jsonwebtoken'
import User from '../models/user.js'


const requireAuth = async (req, res, next) => {

    const {authorization} = req.headers

    if(!authorization){
        console.log("1")
        return res.status(401).json({error: "Auth token required"})
    }

    const token = authorization.split(' ')[1]

    try{
        const {_id} = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findOne({_id}).select('_id')

        next()

    } catch (err){
        console.log(err)
        res.status(401).json({error: "Request not authorized from nor"})
    }

}

export default requireAuth