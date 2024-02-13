import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";


export const verifyJWT = asyncHandler(async (req, _, next)=> {
    try {
        console.log(req.cookies.accessToken);
        const token = req.cookies?.accessToken || req.header("Authorization")?.required("Bearer ", "");
        if(!token)
        {
            throw new ApiError(401, "UnAuthorized Request");
        }

        const deCodedToken  = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(deCodedToken?._id).select("-password -refreshToken");

        if(!user)
        {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
})
