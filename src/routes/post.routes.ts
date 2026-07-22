import { Router } from "express";

import upload from "../config/multer";
import { CommentController } from "../controllers/comment.controller";
import { PostController } from "../controllers/post.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";

const router = Router();

const controller = new PostController();
const commentController =
  new CommentController();

// Criar post
router.post(
  "/",
  verifyToken,
  upload.single("banner"),
  (req, res) => controller.create(req, res),
);

// Listar posts
router.get(
  "/",
  optionalAuth,
  (req, res) => controller.findAll(req, res),
);

// Contabilizar visualização
router.patch(
  "/:id/view",
  (req, res) =>
    controller.incrementView(req, res),
);

// Curtir post
router.post(
  "/:id/like",
  verifyToken,
  (req, res) => controller.like(req, res),
);

// Remover curtida
router.delete(
  "/:id/like",
  verifyToken,
  (req, res) => controller.unlike(req, res),
);

// Listar comentários
router.get(
  "/:postId/comments",
  (req, res) =>
    commentController.list(req, res),
);

// Criar comentário
router.post(
  "/:postId/comments",
  verifyToken,
  (req, res) =>
    commentController.create(req, res),
);

// Atualizar post
router.put(
  "/:id",
  verifyToken,
  upload.single("banner"),
  (req, res) => controller.update(req, res),
);

// Excluir post
router.delete(
  "/:id",
  verifyToken,
  (req, res) => controller.delete(req, res),
);

// Buscar post por ID
router.get(
  "/:id",
  optionalAuth,
  (req, res) =>
    controller.findById(req, res),
);

export default router;