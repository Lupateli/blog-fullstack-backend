import prisma from "../config/prisma";

type UpdateProfileData = {
  name?: string;
  email?: string;
  bio?: string | null;
  avatar?: string | null;
};

export class UserService {
  async findProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    return user;
  }

  async updateProfile(
    userId: number,
    data: UpdateProfileData,
  ) {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!existingUser) {
      throw new Error("Usuário não encontrado.");
    }

    if (
      data.email &&
      data.email.toLowerCase() !==
        existingUser.email.toLowerCase()
    ) {
      const emailAlreadyExists =
        await prisma.user.findUnique({
          where: {
            email: data.email,
          },
          select: {
            id: true,
          },
        });

      if (emailAlreadyExists) {
        throw new Error("Este e-mail já está em uso.");
      }
    }

    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(data.name !== undefined
          ? {
              name: data.name.trim(),
            }
          : {}),
        ...(data.email !== undefined
          ? {
              email: data.email
                .trim()
                .toLowerCase(),
            }
          : {}),
        ...(data.bio !== undefined
          ? {
              bio: data.bio?.trim() || null,
            }
          : {}),
        ...(data.avatar !== undefined
          ? {
              avatar: data.avatar?.trim() || null,
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    });
  }
}