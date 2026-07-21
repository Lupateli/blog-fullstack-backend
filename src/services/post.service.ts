import prisma from "../config/prisma";

interface CreatePostData {
  title: string;
  content: string;
  category?: string;
  banner?: string;
  authorId: number;
}

export class PostService {
  async create(data: CreatePostData) {
    return prisma.post.create({
      data,
    });
  }

  async findAll() {
    return prisma.post.findMany({
        include: {
        author: {
            select: {
            id: true,
            name: true,
            },
        },
        },

        orderBy: {
        createdAt: "desc",
        },
    });
  }

  async findById(id: number) {
    return prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                id: true,
                name: true,
                },
            },
        }
    });
  }


  async update(
    id: number,
    userId: number,
    data: Partial<CreatePostData>
    ) {
    const post = await prisma.post.findUnique({
        where: { id },
    });

    if (!post) {
        throw new Error("Post não encontrado.");
    }

    if (post.authorId !== userId) {
        throw new Error("Não autorizado.");
    }

    return prisma.post.update({
        where: { id },
        data,
    });
    }

  async delete(id: number, userId: number) {
    const post = await prisma.post.findUnique({
        where: { id },
    });

    if (!post) {
        throw new Error("Post não encontrado.");
    }

    if (post.authorId !== userId) {
        throw new Error("Não autorizado.");
    }

    return prisma.post.delete({
        where: { id },
    });
    }
    async incrementView(id: number) {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Post não encontrado");
  }

  return prisma.post.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  });
}

async incrementLike(id: number) {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Post não encontrado");
  }

  return prisma.post.update({
    where: { id },
    data: {
      likes: {
        increment: 1,
      },
    },
  });
}
}