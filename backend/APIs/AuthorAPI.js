import exp from 'express';
import { articleModel } from '../models/ArticleModel.js';
import { userModel } from '../models/UserModel.js';
import { verifyToken } from '../middlewares/verifyToken.js';

export const authorAPP = exp.Router();

/**
 * Route: POST /article
 * Description: Write a new article (protected author route).
 */
authorAPP.post("/article", verifyToken("AUTHOR"), async (request, response) => {
    try {
        if (request.body.author !== request.user.id) {
            return response.status(401).json({ message: "Unauthorized! You can only create articles for yourself." });
        }

        //check author
        let author = await userModel.findById(request.body.author);
        if (!author) { 
            return response.status(404).json({ message: "Invalid Author" }); 
        }
        
        //create article document
        const newArticle = { ...request.body, author: request.user.id };
        const article = new articleModel(newArticle);
        
        //save
        await article.save();
        response.status(201).json({ message: "Article created!", payload: article });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: GET /articles
 * Description: Read own articles.
 */
authorAPP.get("/articles", verifyToken("AUTHOR"), async (request, response) => {
    //get author id from decoded token
    const idOfAuthor = request.user?.id;
    
    //get articles by author id
    const articles = await articleModel.find({ author: idOfAuthor });
    response.status(200).json({ message: "Articles fetched!", payload: articles });
});

/**
 * Route: GET /article/:id
 * Description: Read a single article.
 */
authorAPP.get("/article/:id", verifyToken("AUTHOR"), async (request, response) => {
    try {
        // used populate to add info to the op with artical data!
        const article = await articleModel.findById(request.params.id)
            .populate("author", "firstName lastName email")
            .populate("comments.user", "firstName lastName");
            
        if (!article) return response.status(404).json({ message: "Article not found" });
        response.status(200).json({ message: "Article fetched!", payload: article });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

/**
 * Route: PUT /article
 * Description: Edit an existing article.
 */
authorAPP.put("/article", verifyToken("AUTHOR"), async (request, response) => {
    try {
        const modifiedArticle = request.body;
        const article = await articleModel.findById(modifiedArticle._id);
        
        if (!article) return response.status(404).json({ message: "Article not found" });

        //verify ownership
        if (article.author.toString() !== request.user.id) {
            return response.status(401).json({ message: "Unauthorized! You can only edit your own articles." });
        }

        //update article
        const updatedArticle = await articleModel.findByIdAndUpdate(
            modifiedArticle._id, 
            { $set: modifiedArticle }, 
            { new: true, returnDocument: 'after' }
        );
        response.status(200).json({ message: "Article updated!", payload: updatedArticle });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});

authorAPP.patch("/article/restore/:id", verifyToken("AUTHOR"), async (request, response) => {
    try {
        const article = await articleModel.findById(request.params.id);
        if (!article) return response.status(404).json({ message: "Article not found" });

        if (article.author.toString() !== request.user.id) { //request.body.author !== request.user.id
            return response.status(401).json({ message: "Unauthorized! You can only delete your own articles." });
        }

        const updatedArticle = await articleModel.findByIdAndUpdate(request.params.id, { isArticleActive: true }, { returnDocument: 'after' });
        response.status(200).json({ message: "Article deleted!", payload: updatedArticle });
    } catch (err) {
        response.status(500).json({ message: "Server Error", error: err.message });
    }
});