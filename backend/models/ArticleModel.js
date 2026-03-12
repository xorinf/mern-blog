import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "User ID is required!"]

    }
})

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
    catogory: {
        type: String,
        required: [true, "Catogory is Required!"],
        enum: ["SMUT", "FICTION", "FANTASY", "BIO", "THRILLER", "EDU", "HORROR"],
        required: [true, "{Value} is an Invalid catogory!"]
    },
    content: {
        type: String,
        required: [true, "content is required!"],
    },
    comment: [commentSchema]
}, 
{ versionKey: false, timestamps: true, strict: "throw" })

export const articalModel = model("article", articleSchema)