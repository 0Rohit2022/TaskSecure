import { Router } from "express";
const router = Router();
import {
  registerUser,
  refreshAccessToken,
  loginUser,
} from "../controller/user.controller.js";


router.route("/register").post(registerUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/login").post(loginUser);

export default router;