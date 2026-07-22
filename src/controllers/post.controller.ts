import type { Request, Response } from "express";

import { PostService } from "../services/post.service";

const postService = new PostService();

function getErrorResponse(res: Response, error: unknown) {
  const message =
    error instanceof Error ? error.message : "Erro interno";

  const status =
    message === "Não autorizado."
      ? 403
      : message === "Post não encontrado" ||
          message === "Post não encontrado."
        ? 404
        : 400;

  return res.status(status).json({ message });
}

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter(
        (tag): tag is string =>
          typeof tag === "string",
      )
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(value);

    if (Array.isArray(parsedValue)) {
      return parsedValue
        .filter(
          (tag): tag is string =>
            typeof tag === "string",
        )
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  } catch {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

export class PostController {
  async create(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res
          .status(401)
          .json({ message: "Token não informado" });
      }

      const payload = {
        title: req.body.title,
        summary: req.body.summary,
        content: req.body.content,
        category: req.body.category,
        tags: parseTags(req.body.tags),
        authorId: req.userId,
        ...(req.file?.filename
          ? { banner: req.file.filename }
          : {}),
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

  async dashboard(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res
          .status(401)
          .json({ message: "Token não informado" });
      }

      const dashboardData =
        await postService.findDashboard(req.userId);

      return res.json(dashboardData);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res
          .status(400)
          .json({ message: "ID inválido" });
      }

      const post = await postService.findById(
        id,
        req.userId,
      );

      return res.json(post);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res
          .status(401)
          .json({ message: "Token não informado" });
      }

      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res
          .status(400)
          .json({ message: "ID inválido" });
      }

      const payload = {
        ...(typeof req.body.title === "string"
          ? { title: req.body.title }
          : {}),
        ...(typeof req.body.summary === "string"
          ? { summary: req.body.summary }
          : {}),
        ...(typeof req.body.content === "string"
          ? { content: req.body.content }
          : {}),
        ...(typeof req.body.category === "string"
          ? { category: req.body.category }
          : {}),
        ...(req.body.tags !== undefined
          ? { tags: parseTags(req.body.tags) }
          : {}),
        ...(req.file?.filename
          ? { banner: req.file.filename }
          : {}),
      };

      const post = await postService.update(
        id,
        req.userId,
        payload,
      );

      return res.json(post);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res
          .status(401)
          .json({ message: "Token não informado" });
      }

      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res
          .status(400)
          .json({ message: "ID inválido" });
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

      if (!Number.isInteger(id) || id <= 0) {
        return res
          .status(400)
          .json({ message: "ID inválido" });
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
        return res
          .status(401)
          .json({ message: "Token não informado" });
      }

      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res
          .status(400)
          .json({ message: "ID inválido" });
      }

      const result = await postService.like(
        id,
        req.userId,
      );

      return res.status(201).json(result);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }

  async unlike(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res
          .status(401)
          .json({ message: "Token não informado" });
      }

      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res
          .status(400)
          .json({ message: "ID inválido" });
      }

      const result = await postService.unlike(
        id,
        req.userId,
      );

      return res.json(result);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }
}
