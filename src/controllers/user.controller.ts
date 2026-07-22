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
          message: "Usuário não autenticado.",
        });
      }

      const user = await userService.findProfile(
        req.userId,
      );

      return res.status(200).json(user);
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
          message: "Usuário não autenticado.",
        });
      }

      const body = req.body ?? {};

      const name =
        typeof body.name === "string"
          ? body.name.trim()
          : undefined;

      const email =
        typeof body.email === "string"
          ? body.email.trim().toLowerCase()
          : undefined;

      const bio =
        typeof body.bio === "string"
          ? body.bio.trim()
          : undefined;

      const avatar = req.file
        ? `/uploads/avatars/${req.file.filename}`
        : undefined;

      if (name !== undefined && !name) {
        return res.status(400).json({
          message: "Informe o nome completo.",
        });
      }

      if (
        email !== undefined &&
        (!email || !email.includes("@"))
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

     const profileData = {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(avatar !== undefined ? { avatar } : {}),
        };

        const updatedUser =
        await userService.updateProfile(
            req.userId,
            profileData,
        );

      return res.status(200).json(updatedUser);
    } catch (error) {
      return getErrorResponse(res, error);
    }
  }
}