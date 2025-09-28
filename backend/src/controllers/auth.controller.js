import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";

import bcrypt from "bcryptjs";


// signup route
export const signup = async (req, res) => {

    const { userName, password } = req.body; // takes name, email and password
    try {
        // validation checks

        // if any field empty
        if (!userName || !password) {
            return res.status(400).json({ message: "Please fill all the form" });
        }
        // if password too short
        if (password.length < 4) {
            return res.status(400).json({ message: "Password length must be atleast 4" });
        }

        if (userName.length < 3) {
            return res.status(400).json({ message: "Username length must be atleast 4" });
        }

        // check if user already exists
        const user = await User.findOne({ userName }).lean();

        // if user already exists, then show message
        if (user) return res.status(400).json({ message: "You have already registered!" });

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = new User(
            {
                userName: userName,
                password: hashedPassword
            }
        );

        if (newUser) {
            // generate jwt token
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                userName: newUser.userName,
            });

        } else {
            res.status(400).json({ message: "Invalid User Data" });
        }

    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// login route
export const login = async (req, res) => {

    const { userName, password } = req.body; // takes only email and password

    try {
        // see if user exists
        const user = await User.findOne({ userName }).lean();

        // error is no user exists
        if (!user) {
            return res.status(400).json({ message: "No user exists. Check again." });
        }

        // check for password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Wrong Password!" });
        }

        // user has logged in
        generateToken(user._id, res); // create a JWT token for this user, if logged in

        // return user info
        res.status(200).json({
            _id: user._id,
            userName: user.userName,
        });

    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// logout route
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 }); // delete JWT cookie content
        res.status(200).json({ message: "Logout succesful" });
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// check authentication route
// works like /auth/me returns user current user
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user); // return the logged in user
    } catch (error) {
        console.log("Error in checkAuth controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
