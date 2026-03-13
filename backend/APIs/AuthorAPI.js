import exp from 'express';
import { articleModel } from '../models/ArticleModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';

export const authorAPP = exp.Router();

authorAPP.use(verifyToken);
authorAPP.use((request, response, next) => {
    if (request.user.role !== "AUTHOR") {
        return response.status(401).json({ message: "Unauthorized! Author access required." });
    }
    next();
});

// Add article
authorAPP.post("/article", async (request, response) => {
    try {
        const newArticle = { ...request.body, author: request.user.id };
        const article = new articleModel(newArticle);
        await article.save();
        response.status(201).json({ message: "Article created!", payload: article });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

// View article (only his + others) - Fetching his own and active ones from others
authorAPP.get("/articles", async (request, response) => {
    try {
        const articles = await articleModel.find({
            $or: [
                { isArticleActive: true },
                { author: request.user.id }
            ]
        }).populate("author", "firstName lastName email").sort({ createdAt: -1 });
        response.status(200).json({ message: "Articles fetched!", payload: articles });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

// View single article
authorAPP.get("/article/:id", async (request, response) => {
    try {
        const article = await articleModel.findById(request.params.id).populate("author", "firstName lastName email").populate("comment.user", "firstName lastName");
        if (!article) return response.status(404).json({ message: "Article not found" });
        response.status(200).json({ message: "Article fetched!", payload: article });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Edit article
authorAPP.put("/article", async (request, response) => {
    try {
        const modifiedArticle = request.body;
        const article = await articleModel.findById(modifiedArticle._id);
        if (!article) return response.status(404).json({ message: "Article not found" });
        
        if (article.author.toString() !== request.user.id) {
            return response.status(401).json({ message: "Unauthorized! You can only edit your own articles." });
        }
        
        const updatedArticle = await articleModel.findByIdAndUpdate(modifiedArticle._id, modifiedArticle, { returnDocument: 'after' });
        response.status(200).json({ message: "Article updated!", payload: updatedArticle });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Delete article (soft delete)
authorAPP.delete("/article/:id", async (request, response) => {
    try {
        const article = await articleModel.findById(request.params.id);
        if (!article) return response.status(404).json({ message: "Article not found" });
        
        if (article.author.toString() !== request.user.id) {
            return response.status(401).json({ message: "Unauthorized! You can only delete your own articles." });
        }
        
        const updatedArticle = await articleModel.findByIdAndUpdate(request.params.id, { isArticleActive: false }, { returnDocument: 'after' });
        response.status(200).json({ message: "Article deleted!", payload: updatedArticle });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});
