import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export class AuthService {
  async register({ name, email, password }: RegisterData) {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new Error("Email já cadastrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return user;
    }
    async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("Email ou senha inválidos.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error("Email ou senha inválidos.");
    }

    const token = jwt.sign(
        {
        id: user.id,
        },
        process.env.JWT_SECRET as string,
        {
        expiresIn: "1d",
        }
    );

    return {
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
        },
        token,
    };
    }
}