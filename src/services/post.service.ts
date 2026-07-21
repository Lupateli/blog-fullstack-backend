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
    });
  }

  async findById(id: number) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  async update(id: number, data: Partial<CreatePostData>) {
    return prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.post.delete({
      where: { id },
    });
  }
}