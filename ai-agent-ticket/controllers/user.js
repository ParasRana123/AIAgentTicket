import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import {inngest} from "../inngest/client";

export const signup = async (req , res) => {
    const {email , password , skills=[]} = req.body;
    const hashed = bcrypt.hash(password , 10);
    const user = await User.create({email , password: hashed , skills});

    // Fire the inngest event\
    await inngest.send({
        name: "user/signup",
        data: {
            email
        }
    })

    // Logging th eisgnup user
    const token = jwt.sign({ __id: user._id , role: user.role } , process.env.JWT_SECRET);

    res.json({user , token});

    try {

    } catch(error) {
        res.status(500).json({
            error: "SignUp failed",
            details: error.message
        })
    }
}