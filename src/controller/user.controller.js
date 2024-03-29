import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessTokensandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access Tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    //Steps for Register User
    //Get User Details from the frontend
    //Validation ---- Not Empty
    //Check if the user is already exist or not
    //Create User Object --- Create entry in database
    //Remove Password and refresh Token from the field
    //check for userCreation
    //return response
    const { username, email, password } = req.body;
    console.log(username, email, password);

    if ([username, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All Fields are compulsory");
    }
    console.log("warning 1");

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    console.log("warning 2");
    if (existedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }
    console.log("warning 3");
    const user = await User.create({
      username,
      email,
      password,
    });
    console.log("warning 4");
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    console.log("warning 5");
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering a User ");
    }

    console.log("warning 6");
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered Successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while registering the user",
      error
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
 try {
   //Steps for the loginUser
   //Get the data from the frontend
   //Check if the user logged in via username or email
   //Check if the user exist or not
   //Check for the password(Check if the password is matched or not)
   //Access and Refresh Token
   //Send Cookie
   const { email, username, password } = req.body;
 
   if (!(username || email)) {
     throw new ApiError(400, "Username or Password is required");
   }
 
   const user = await User.findOne({
     $or: [{ username }, { email }],
   });
 
   if (!user) {
     throw new ApiError(404, "User does not exist");
   }
 
   const isPasswordValid = await user.isPasswordCorrect(password);
 
   if (!isPasswordValid) {
     console.log("Invalid username or password 1");
     throw new ApiError(401, "Invalid Username or password");
   }
 
   const { accessToken, refreshToken } =
     await generateAccessTokensandRefreshTokens(user._id);
 
   const loggedInUser = await User.findById(user._id).select(
     "-password -refreshToken"
   );
 
   const options = {
     httpOnly: true,
     secure: true,
   };
 
   return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", refreshToken, options)
     .json(
       new ApiResponse(
         200,
         {
           user: loggedInUser,
           accessToken,
           refreshToken,
         },
         "User logged in Successfully"
       )
     );
 } catch (error) {
    throw new ApiError(500, "Something Went wrong while logging In", error);
 }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  return res.status(200).json({ user });
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, //This will remove the selected field from the document.
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthroized Request");
    }

    const deCodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(deCodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (!incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newrefreshToken } =
      await generateAccessTokensandRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newrefreshToken,
          },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

export {
  registerUser,
  refreshAccessToken,
  loginUser,
  getCurrentUser,
  logoutUser,
};
