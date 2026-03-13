import exp from 'express';
import { articleModel } from '../models/ArticleModel.js';
import { userModel } from '../models/UserModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';

export const adminAPP = exp.Router();

adminAPP.use(verifyToken);
adminAPP.use((request, response, next) => {
    if (request.user.role !== "ADMIN") {
        return response.status(401).json({ message: "Unauthorized! Admin access required." });
    }
    next();
});

// Admin: View all articles (everyone)
adminAPP.get("/articles", async (request, response) => {
    try {
        const articles = await articleModel.find({}).populate("author", "firstName lastName email").sort({ createdAt: -1 });
        response.status(200).json({ message: "All articles fetched!", payload: articles });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Admin: Get all users
adminAPP.get("/users", async (request, response) => {
    try {
        const users = await userModel.find({ role: { $ne: "ADMIN" } }, { password: 0 });
        response.status(200).json({ message: "Users fetched!", payload: users });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Admin: Block & Activate User
adminAPP.put("/user-status/:id", async (request, response) => {

});
