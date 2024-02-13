import asyncHandler from "../utils/asyncHandler.js"
import {User} from "../models/user.models.js"
import ApiError from "../utils/ApiError.js"


const getAllUser = asyncHandler(async(req,res) => {
  try {
    // const user = await User.find()
  } catch (error) {
    throw new ApiError(500, "Something went wrong while getting all the user");
  }
})


export {getAllUser}