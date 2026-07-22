import type { Request, Response } from "express";
import prisma from "../config/prisma";

type AuthenticatedRequest = Request & {
  userId?: number;
  user?: {
    id?: number;
  };
};

function getAuthenticatedUserId(
  req: AuthenticatedRequest,
) {
  return req.userId ?? req.user?.id;
}

export class CommentController {
  async list(req: Request, res: Response) {
    try {
      const postId = Number(req.params.postId);

      if (!Number.isInteger(postId) || postId <= 0) {
        return res.status(400).json({
          message: "ID do post inválido.",
        });
      }

      const comments = await prisma.comment.findMany({
        where: {
          postId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(200).json(comments);
    } catch (error) {
      console.error(
        "Erro ao listar comentários:",
        error,
      );

      return res.status(500).json({
        message:
          "Não foi possível carregar os comentários.",
      });
    }
  }

  async create(
    req: AuthenticatedRequest,
    res: Response,
  ) {
    try {
      const postId = Number(req.params.postId);

      const authorId =
        getAuthenticatedUserId(req);

      const content =
        typeof req.body?.content === "string"
          ? req.body.content.trim()
          : "";

      if (!Number.isInteger(postId) || postId <= 0) {
        return res.status(400).json({
          message: "ID do post inválido.",
        });
      }

      if (!authorId) {
        return res.status(401).json({
          message: "Usuário não autenticado.",
        });
      }

      if (!content) {
        return res.status(400).json({
          message:
            "O conteúdo do comentário é obrigatório.",
        });
      }

      if (content.length < 3) {
        return res.status(400).json({
          message:
            "O comentário deve ter pelo menos 3 caracteres.",
        });
      }

      if (content.length > 1000) {
        return res.status(400).json({
          message:
            "O comentário deve ter no máximo 1000 caracteres.",
        });
      }

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          id: true,
        },
      });

      if (!post) {
        return res.status(404).json({
          message: "Post não encontrado.",
        });
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          postId,
          authorId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(201).json(comment);
    } catch (error) {
      console.error(
        "Erro ao criar comentário:",
        error,
      );

      return res.status(500).json({
        message:
          "Não foi possível criar o comentário.",
      });
    }
  }
}