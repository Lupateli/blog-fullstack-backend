import { Request, Response } from "express";
import { PostService } from "../services/post.service";

const postService = new PostService();

export class PostController {
  async create(req: Request, res: Response) {
    try {
      const post = await postService.create(req.body);

      return res.status(201).json(post);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Erro interno",
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const posts = await postService.findAll();

      return res.json(posts);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Erro interno",
      });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const post = await postService.findById(id);

      if (!post) {
        return res.status(404).json({ message: "Post não encontrado." });
      }

      return res.json(post);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Erro interno",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const post = await postService.update(id, req.body);

      return res.json(post);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Erro interno",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await postService.delete(id);

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Erro interno",
      });
    }
  }
}
