import exp from 'express';
import { userModel } from '../models/UserModel.js';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { verifyToken } from '../middlewares/verifyToken.js';
import { upload } from '../config/multer.js';
import { uploadToCloudinary } from '../config/cloudinaryUpload.js';
import cloudinary from '../config/cloudinary.js';

export const commonAPP = exp.Router();
config();

/*
 * Route: POST /register
 * Description: Register a new user (author or standard user).
 * Accepts multipart/form-data with optional profile image file.
 */
commonAPP.post("/register", upload.single("profileImageUrl"), async (request, response, next) => {
    let cloudinaryResult;
    try {
        //get user data
        const newUser = request.body;

        //explicitly prevent ADMIN registration
        if (newUser?.role === "ADMIN") {
            return response.status(403).json({ message: "Registration as ADMIN forbidden." });
        }

        let isallowedRole = ['USER', 'AUTHOR'].includes(newUser?.role);

        if (isallowedRole) {
            //Upload image to cloudinary from memoryStorage if file exists
            if (request.file) {
                cloudinaryResult = await uploadToCloudinary(request.file.buffer);
                //add CDN link of image to newUserObj
                newUser.profileImageUrl = cloudinaryResult?.secure_url;
            }

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
    } catch (err) {
        //delete image from cloudinary on error if it was uploaded
        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }
        next(err);
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

    //create jwt with full user info for check-auth restore
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
        },
        "chicken",
        { expiresIn: "1h" }
    );

    //remove password from user response
    let userObj = user.toObject();
    delete userObj.password;

    //set token to res header as httpOnly cookie
    response.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
    response.status(200).json({ message: "Login Successful", payload: userObj });
});


commonAPP.put("/password", verifyToken("USER", "AUTHOR", "ADMIN"), async (request, response) => {
    // get current password and new password! form the body
    const { current_pass, new_pass } = request.body;
    const user = await userModel.findById(request.user.id)
    // get current password! and check the current password of the request and user is same
    if (await compare(current_pass, user.password)) {
        // change the password (update) after hashing new password!
        let new_password = await hash(new_pass, 12);
        user.password = new_password
        //save
        await user.save({validateBeforeSave : true})
         //send response
        return response.status(201).json({ message: "Password Changed!" })
    }
    
    //send response
    return response.status(401).json({ message: "Invalid Current Password!" })

});

/**
 * Route: GET /check-auth
 * Description: Verify JWT cookie and restore user session on page refresh.
 */
commonAPP.get("/check-auth", verifyToken("USER", "AUTHOR", "ADMIN"), (request, response) => {
    response.status(200).json({
        message: "authenticated",
        payload: request.user,
    });
});

/*
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