import { Request, Response } from "express";
import { PostService } from "../services/post.service";

const postService = new PostService();

function getErrorResponse(res: Response, error: unknown) {
  const message = error instanceof Error ? error.message : "Erro interno";
  const status =
    message === "Não autorizado."
      ? 403
      : message === "Post não encontrado"
        ? 404
        : 400;

  return res.status(status).json({ message });
}

export class PostController {
  async create(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Token não informado" });
      }

      const payload = {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        authorId: req.userId,
        ...(req.file?.filename ? { banner: req.file.filename } : {}),
      };

      const post = await postService.create(payload);

      return res.status(201).json(post);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const posts = await postService.findAll(req.userId);

      return res.json(posts);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const post = await postService.findById(id, req.userId);

      return res.json(post);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Token não informado" });
      }

      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const post = await postService.update(id, req.userId, req.body);

      return res.json(post);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Token não informado" });
      }

      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      await postService.delete(id, req.userId);

      return res.status(204).send();
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }

  async incrementView(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const post = await postService.incrementView(id);

      return res.json(post);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }

  async like(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Token não informado" });
      }

      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const result = await postService.like(id, req.userId);

      return res.status(201).json(result);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }

  async unlike(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Token não informado" });
      }

      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const result = await postService.unlike(id, req.userId);

      return res.json(result);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }
}
