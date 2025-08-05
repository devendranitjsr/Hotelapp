import { Message } from "svix/dist/api/message.js";
import User from "../models/User.js";

// middleware to check if user is authatication

export const protect = async(req , res , next) => {

    const { userId } = await req.auth();
    if(!userId)
        {
        return res.json({success: false ,message: "Not authenticated"})
    }
    else{
        const user = await User.findById(userId);
        req.user = user;
        next()
    }
}


// export const protect = async (req, res, next) => {
//   try {
//     const { userId } = await req.auth(); // 👈 FIXED HERE

//     if (!userId) {
//       return res.status(401).json({ success: false, message: "Not authenticated" });
//     }

//     const user = await User.findById(userId); // ya findOne({ _id: userId }) if _id === Clerk ID

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("Auth error:", error.message);
//     res.status(500).json({ success: false, message: "Authentication failed" });
//   }
// };