import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();
const controller = new PostController();

router.post("/", verifyToken, controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id", verifyToken, controller.update);
router.delete("/:id", verifyToken, controller.delete);

export default router;
