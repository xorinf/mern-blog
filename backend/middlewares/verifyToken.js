import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token and allowed roles.
 * This is a funtion which will return a middleware where we can use in the routes as middleware but with tweaks we refractored the code
 * where this function takes the type of role and decodes the token with it if isValid it will return valid session/token where user can
 * access the protected routes!
 */
export const verifyToken = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            //extract token from cookie
            const token = req.cookies?.token;
            if (!token) { return res.status(401).json({ message: "Unauthorized Request. Token missing!" }); }

            //verify token using secret
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            //check if user role is within allowed roles for the route
            if (allowedRoles.length && !allowedRoles.includes(decodedToken.role)) {
                return res.status(403).json({ message: "You are not authorized!" });
            }

            //attach decoded token object to request
            req.user = decodedToken;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid or Expired Token!" });
        }
    }
}