import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import upload from "../config/multer";

const router = Router();
const controller = new PostController();

router.post(
  "/",
  verifyToken,
  upload.single("banner"),
  controller.create
);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);



export default router;
