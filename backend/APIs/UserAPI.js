import exp from 'express';
import { articleModel } from '../models/ArticleModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';

export const userAPP = exp.Router();

// add's verification middleware to all the routes! so we dont have to type again and again or forget
userAPP.use(verifyToken("USER"));

/**
 * Route: GET /articles
 * Description: View all active articles.
 */
userAPP.get("/articles", async (request, response) => {
    try {
        const articles = await articleModel.find({ isArticleActive: true })
            .populate("author", "firstName lastName email")
            .sort({ createdAt: -1 });

        response.status(200).json({ message: "Articles fetched!", payload: articles });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: GET /article/:id
 * Description: View a specific active article.
 */
userAPP.get("/article/:id", async (request, response) => {
    try {
        const article = await articleModel.findOne({ _id: request.params.id, isArticleActive: true })
            .populate("author", "firstName lastName email")
            .populate("comments.user", "firstName lastName");

        if (!article) return response.status(404).json({ message: "Article not found or not active" });
        response.status(200).json({ message: "Article fetched!", payload: article });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: POST /comment/:articleId
 * Description: Write a comment on a specific active article.
 */
userAPP.put("/comment", async (request, response) => {
    try {
        const { comment, article_id } = request.body;
        const newComment = {
            user: request.user.id,
            comment: comment
        };
        if (comment === null || comment === undefined || comment === "" || comment === " "){
            return response.status(401).json({message : "Invalid Comment!"})
        }

        //push to comments array in model
        const updatedArticle = await articleModel.findOneAndUpdate(
            { _id: article_id, isArticleActive: true },
            { $push: { comments: newComment } },
            { returnDocument: 'after' }
        );

        if (!updatedArticle) {
            return response.status(404).json({ message: "Article not found or not active" });
        }

        response.status(201).json({ message: "Comment added!", payload: updatedArticle });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});
