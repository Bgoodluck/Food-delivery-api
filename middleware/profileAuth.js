import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const profileAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again Now" });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        req.user = user;            // this logic is so that i can attach the user to the request
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Error. Invalid Token" });
    }
};

export default profileAuth;
