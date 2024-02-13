import { Router } from "express";
const router = Router();
import {verifyJWT} from "../middleware/auth.middleware.js"
import {
  registerUser,
  refreshAccessToken,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../controller/user.controller.js";


router.route("/register").post(registerUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/login").post(loginUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/logout").post(verifyJWT,logoutUser);

export default router;