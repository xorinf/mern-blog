import exp from 'express'
import { userModel } from '../models/UserModel.js'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
export const commonAPP = exp.Router()

// routes for register
commonAPP.post("/users", async (request, response) => {
    // get user data
    const newUser = request.body
    //hash pass
    newUser.password = await hash(newUser.password, 12)
    // create new user doc
    const newUserDoc = new userModel(newUser)
    
    await newUserDoc.save()
    response.status(201).json({message : "user created!"})
})
// route for login
commonAPP.post("/login", async (request, response) => {
    const { email, password } = request.body;
    
    const user = await userModel.findOne({ email });
    if (!user) {
        return response.status(404).json({ message: "Invalid Email or Password!" });
    }
    
    const isMatched = await compare(password, user.password);
    if (!isMatched) {
        return response.status(404).json({ message: "Invalid Email or Password!" });
    }
    
    if (!user.isUserActive) {
        return response.status(401).json({ message: "User is blocked! Contact Admin!" });
    }
    
    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET || "chicken", 
        { expiresIn: "1d" }
    );
    //remove pass
    user.password = undefined;
    response.status(200).json({ message: "Login Successful", token, user });
});

// route for logout
commonAPP.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout Successful" });
});