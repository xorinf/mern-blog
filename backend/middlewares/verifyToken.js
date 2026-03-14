import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token and allowed roles.
 * @param {...string} allowedRoles - Dynamic rest parameter gathering allowed roles (e.g. "USER", "AUTHOR").
 * @returns {Function} Express middleware function.
 */
export const verifyToken = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            //extract token from cookie
            const token = req.cookies?.token;
            if (!token) { return res.status(401).json({ message: "Unauthorized Request. Token missing!" }); }

            //verify token using secret
            const decodedToken = jwt.verify(token, "chicken");

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