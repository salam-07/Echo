import jwt from "jsonwebtoken";

// generate JWT for auth verifications
export const generateToken = (userId, res) => {
    // create the token for user
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    // send the created token in a cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevents XSS attacks
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
};