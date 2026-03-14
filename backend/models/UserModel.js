import { Schema, model } from "mongoose";

//create user schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required!!!"],
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is required!!"],
        unique: [true, "Email already in use!!"]
    },
    password: {
        type: String,
        required: [true, "Password Required!"],
    },
    role: {
        type: String,
        enum: ["USER", "AUTHOR", "ADMIN"],
        required: [true, "{Value} is an Invalid Role"]
    },
    profileImageUrl: {
        type: String
    },
    isUserActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false,
    strict: "throw"
});

//create user model
export const userModel = model("user", userSchema);