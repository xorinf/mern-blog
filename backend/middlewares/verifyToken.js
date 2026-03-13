import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const Token = req.headers.authorization;
    if (!Token) {
        return res.status(401).json({ message: "Unauthorized Request. Token missing!" });
    }
    
    const token = Token.split(" ")[1];
    console.log(token)
    
    // Verify token
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "chicken");
        req.user = decodedToken;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or Expired Token!" });
    }
};
