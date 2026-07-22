import { Router } from "express";
import { upload } from "../config/upload";
import { UserController } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();
const controller = new UserController();

router.get(
  "/me",
  verifyToken,
  (req, res) =>
    controller.profile(req, res),
);

router.put(
  "/me",
  verifyToken,
  upload.single("avatar"),
  (req, res) => controller.updateProfile(req, res)
);

export default router;