import exp from 'express';
import { userModel } from '../models/UserModel.js';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

export const commonAPP = exp.Router();
config();

/**
 * Route: POST /register
 * Description: Register a new user (author or standard user).
 */
commonAPP.post("/register", async (request, response) => {
    //get user data
    const newUser = request.body;
    
    //explicitly prevent ADMIN registration
    if (newUser?.role === "ADMIN") {
        return response.status(403).json({ message: "Registration as ADMIN forbidden." });
    }

    let isallowedRole = ['USER', 'AUTHOR'].includes(newUser?.role);

    if (isallowedRole) {
        //hash password and replace plain with hashed one
        newUser.password = await hash(newUser.password, 12);
        
        //create new user document
        const newUserDoc = new userModel(newUser);
        
        //save document
        await newUserDoc.save();
        response.status(201).json({ message: "user created!" });
    } else {
        response.status(400).json({ message: "Invalid role!" });
    }
});

/**
 * Route: POST /login
 * Description: Authenticate user, set JWT cookie.
 */
commonAPP.post("/login", async (request, response) => {
    //get user credentials
    const { email, password } = request.body;
    
    //find user by email
    let user = await userModel.findOne({ email: email });
    
    //if not found by plain email, check if it's an admin with a hashed email
    if (!user) {
        const admins = await userModel.find({ role: "ADMIN" });
        for (let admin of admins) {
            const isEmailMatched = await compare(email, admin.email);
            if (isEmailMatched) {
                user = admin;
                break;
            }
        }
    }

    if (!user) {
        return response.status(404).json({ message: "Invalid Email!" });
    }

    //compare password
    const isMatched = await compare(password, user.password);
    if (!isMatched) {
        return response.status(400).json({ message: "Invalid Password!" });
    }

    //check if user is active
    if (!user.isUserActive) {
        return response.status(401).json({ message: "User is blocked! Contact Admin!" });
    }

    //create jwt
    const token = jwt.sign(
        { id: user._id, role: user.role }, "chicken",
        { expiresIn: "1h" }
    );
    
    //remove password from user response
    user.password = undefined;

    //set token to res header as httpOnly cookie
    response.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
    response.status(200).json({ message: "Login Successful", Token: token, User: user });
});

/**
 * Route: GET /logout
 * Description: Log out user by clearing JWT cookie.
 */
commonAPP.get("/logout", (request, response) => {
    //delete token from cookie storage
    response.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    response.status(200).json({ message: "Logout Successful" });
});