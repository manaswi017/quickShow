// import { clerkClient } from "@clerk/express";

// export const protectAdmin=async(req, res, next)=>{
//     try {
//         const {userId}=req.auth();
//         const user=await clerkClient.users.getUser(userId);
//         if(user.privateMetadata.role!=='admin'){
//             return res.json({success: false, message: "not authprized"})
//         }
//         // if admin, proceed
//         next();
//     } catch(error){
//         return res.json({success: false, message: "not authorized"});
//     }
// }

import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
    try {
        const userId = req.auth.userId; // Changed: access as property, not function
        const user = await clerkClient.users.getUser(userId);
        if (user.privateMetadata.role !== 'admin') {
            return res.json({ success: false, message: "Not authorized" })
        }
        // if admin, proceed
        next();
    } catch (error) {
        return res.json({ success: false, message: "Not authorized" });
    }
}