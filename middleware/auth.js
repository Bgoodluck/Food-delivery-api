import jwt from 'jsonwebtoken';


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader); 
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again Now" });
    }

    const token = authHeader.split(' ')[1]; //Added this to extract the token after 'Bearer' after the headache from bad:auth msg
    console.log('Extracted Token:', token); 
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Error. Invalid Token" });
        console.log('JWT Secret:', process.env.JWT_SECRET);
        
    }
}

export default authMiddleware;
