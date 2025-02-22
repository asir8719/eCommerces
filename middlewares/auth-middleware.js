import jwt from "jsonwebtoken"
import { User } from "../models/user-model.js";

const authMiddleware = async(req, res, next) =>{
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({msg: 'Authorization Denied'});
    }
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({msg: 'Authorization Denied'})
    }
    try {
        const isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userData = await User.findOne({ _id: isVerified.userId }).select('-password')
        console.log(userData);
        req.user = userData
        req.token = token
        req.id = userData._id
        next()
    } catch (error) {
        return res.status(401).json({msg: 'Authorization Denied'})
    }
}

export {authMiddleware}