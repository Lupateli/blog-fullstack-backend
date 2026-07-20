import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);

      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Erro interno",
      });
    }
  }
  async login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const data = await authService.login(email, password);

        return res.json(data);
    } catch (error) {
        return res.status(401).json({
        message: error instanceof Error ? error.message : "Erro interno",
        });
    }
    }
}