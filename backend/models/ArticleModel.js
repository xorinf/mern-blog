import { Schema, model, Types } from "mongoose";

//create comment schema
const commentSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "User ID is required!"]
    },
    comment: {
        type: String,
        required: [true, 'The comment field cannot be empty!']
        
    }
});

//create article schema
const articleSchema = new Schema({
    author: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "Author ID is required!"]
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    category: {
        type: String,
        required: [true, "Category is Required!"],
        enum: ["SMUT", "FICTION", "FANTASY", "BIO", "THRILLER", "EDU", "HORROR"]
    },
    content: {
        type: String,
        required: [true, "content is required!"],
    },
    imageUrl: {
        type: String
    },
    comments: [{ type: commentSchema, default: [] }],
    isArticleActive: {
        type: Boolean,
        default: true
    }
}, { 
    versionKey: false, 
    timestamps: true, 
    strict: "throw" 
});

//create article model
export const articleModel = model("article", articleSchema);