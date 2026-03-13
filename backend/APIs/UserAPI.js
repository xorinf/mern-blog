import exp from 'express';
import { articleModel } from '../models/ArticleModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';

export const userAPP = exp.Router();

userAPP.use(verifyToken);
userAPP.use((request, response, next) => {
    if (request.user.role !== "USER") {
        return response.status(401).json({ message: "Unauthorized! User access required." });
    }
    next();
});

// View active articles
userAPP.get("/articles", async (request, response) => {
    try {
        const articles = await articleModel.find({ isArticleActive: true }).populate("author", "firstName lastName email").sort({ createdAt: -1 });
        response.status(200).json({ message: "Articles fetched!", payload: articles });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

// View specific article
userAPP.get("/article/:id", async (request, response) => {
    try {
        const article = await articleModel.findOne({ _id: request.params.id, isArticleActive: true })
            .populate("author", "firstName lastName email")
            .populate("comment.user", "firstName lastName");
        if (!article) return response.status(404).json({ message: "Article not found or not active" });
        response.status(200).json({ message: "Article fetched!", payload: article });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Write comments
userAPP.post("/comment/:articleId", async (request, response) => {
    try {
        const { comment } = request.body;
        const newComment = {
            user: request.user.id,
            comment: comment
        };
        
        const updatedArticle = await articleModel.findOneAndUpdate(
            { _id: request.params.articleId, isArticleActive: true },
            { $push: { comment: newComment } },
            { returnDocument: 'after' }
        );
        if (!updatedArticle) {return response.status(404).json({ message: "Article not found or not active" });}
        
        response.status(201).json({ message: "Comment added!", payload: updatedArticle });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});
