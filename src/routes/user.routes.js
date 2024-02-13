import { Router } from "express";
const router = Router();
import {
  registerUser,
  refreshAccessToken,
} from "../controller/user.controller.js";


router.route("/register").post(registerUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;