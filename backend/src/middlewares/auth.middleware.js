import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            return res.status(401).json({ message : "Not authorized, token failed" });
        }
    } else {    
        return res.status(401).json({ message: "Not authorized, no token" });
    }
}

export const adminOnly = async (req, res, next) => {
    console.log("User role:", req.user?.role);
    
    if (req.user && req.user.role === "Admin") {
        next();
    } else {
        res.status(403).json({ message: "Admin access only!" });
    }
};