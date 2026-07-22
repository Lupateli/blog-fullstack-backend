import type { Request, Response } from "express";

import { UserService } from "../services/user.service";

const userService = new UserService();

function getErrorResponse(
  res: Response,
  error: unknown,
) {
  const message =
    error instanceof Error
      ? error.message
      : "Erro interno.";

  const status =
    message === "Usuário não encontrado."
      ? 404
      : message === "Este e-mail já está em uso."
        ? 409
        : 400;

  return res.status(status).json({
    message,
  });
}

export class UserController {
  async profile(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: "Token não informado.",
        });
      }

      const user = await userService.findProfile(
        req.userId,
      );

      return res.json(user);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
  ) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          message: "Token não informado.",
        });
      }

      const name =
        typeof req.body.name === "string"
          ? req.body.name.trim()
          : undefined;

      const email =
        typeof req.body.email === "string"
          ? req.body.email.trim()
          : undefined;

      const bio =
        typeof req.body.bio === "string"
          ? req.body.bio
          : undefined;

      const avatar =
        typeof req.body.avatar === "string"
          ? req.body.avatar
          : undefined;

      if (name !== undefined && !name) {
        return res.status(400).json({
          message: "Informe o nome.",
        });
      }

      if (
        email !== undefined &&
        !email.includes("@")
      ) {
        return res.status(400).json({
          message: "Informe um e-mail válido.",
        });
      }

      if (
        bio !== undefined &&
        bio.length > 500
      ) {
        return res.status(400).json({
          message:
            "A biografia deve ter no máximo 500 caracteres.",
        });
      }

      const updatedUser =
        await userService.updateProfile(
          req.userId,
          {
            name,
            email,
            bio,
            avatar,
          },
        );

      return res.json(updatedUser);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }
}