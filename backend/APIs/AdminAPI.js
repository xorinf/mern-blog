import exp from 'express';
import { articleModel } from '../models/ArticleModel.js';
import { userModel } from '../models/UserModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';

export const adminAPP = exp.Router();

/**
 * Route: GET /articles
 * Description: Admin view of all articles (active and inactive).
 */
adminAPP.get("/articles", verifyToken("ADMIN"), async (request, response) => {
    try {
        const articles = await articleModel.find({})
            .populate("author", "firstName lastName email")
            .sort({ createdAt: -1 });
            
        response.status(200).json({ message: "All articles fetched!", payload: articles });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: GET /users
 * Description: Admin view of all non-admin users in the system.
 */
adminAPP.get("/users", verifyToken("ADMIN"), async (request, response) => {
    try {
        const users = await userModel.find({ role: { $ne: "ADMIN" } }, { password: 0 });
        response.status(200).json({ message: "Users fetched!", payload: users });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: PATCH /user-status/:id
 * Description: Admin toggle to block/activate an existing user.
 */
adminAPP.patch("/users/status/:id", verifyToken("ADMIN"), async (request, response) => {
    try {
        //find user by ID
        const user = await userModel.findById(request.params.id);
        if(!user) return response.status(404).json({ message: "User not found" });

        //toggle boolean
        user.isUserActive = !user.isUserActive;
        
        //save updated!
        await user.save();
        response.status(200).json({ message: "User status updated!", payload: user });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});


/*
 * Admin login
 * Read all users and authors
 * author data
 * block or activate user or author
 */