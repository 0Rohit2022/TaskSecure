import { Router } from "express";
import { newTask, getMyTask, updateMyTask, deleteMyTask } from "../controller/task.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/newtask").post(verifyJWT, newTask);
router.route("/mytask").get(verifyJWT, getMyTask);
router
  .route("/:id")
  .put(verifyJWT, updateMyTask)
  .delete(verifyJWT, deleteMyTask);

export default router;
