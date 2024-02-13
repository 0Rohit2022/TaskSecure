import { Router } from "express";
const router = Router();
import { getAllUser } from "../controller/user.controller.js";


router.route("/all").get(getAllUser);

export default router;