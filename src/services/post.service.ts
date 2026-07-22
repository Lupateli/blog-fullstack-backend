import prisma from "../config/prisma";

interface CreatePostData {
  title: string;
  summary?: string;
  content: string;
  category?: string;
  tags?: string[];
  banner?: string;
  authorId: number;
}

interface UpdatePostData {
  title?: string;
  summary?: string;
  content?: string;
  category?: string;
  tags?: string[];
  banner?: string;
}

export class PostService {
  async create(data: CreatePostData) {
    return prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        ...(data.summary
          ? { summary: data.summary }
          : {}),
        ...(data.category
          ? { category: data.category }
          : {}),
        ...(data.tags
          ? { tags: JSON.stringify(data.tags) }
          : {}),
        ...(data.banner
          ? { banner: data.banner }
          : {}),
        author: {
          connect: {
            id: data.authorId,
          },
        },
      },
    });
  }

  async findAll(userId?: number) {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          where: {
            userId: userId ?? -1,
          },
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts.map(
      ({ _count, likes, ...post }) => ({
        ...post,
        likesCount: _count.likes,
        commentsCount: _count.comments,
        likedByCurrentUser: likes.length > 0,
      }),
    );
  }

  async findDashboard(userId: number) {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const recentComments =
      await prisma.comment.findMany({
        where: {
          post: {
            authorId: userId,
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });

    return {
      posts: posts.map(({ _count, ...post }) => ({
        ...post,
        likesCount: _count.likes,
        commentsCount: _count.comments,
      })),
      recentComments,
    };
  }

  async findById(id: number, userId?: number) {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          where: {
            userId: userId ?? -1,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error("Post não encontrado");
    }

    const { _count, likes, ...postData } = post;

    return {
      ...postData,
      likesCount: _count.likes,
      commentsCount: _count.comments,
      likedByCurrentUser: likes.length > 0,
    };
  }

  async update(
    id: number,
    userId: number,
    data: UpdatePostData,
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
      data: {
        ...(data.title !== undefined
          ? { title: data.title.trim() }
          : {}),
        ...(data.summary !== undefined
          ? { summary: data.summary.trim() }
          : {}),
        ...(data.content !== undefined
          ? { content: data.content.trim() }
          : {}),
        ...(data.category !== undefined
          ? { category: data.category }
          : {}),
        ...(data.tags !== undefined
          ? { tags: JSON.stringify(data.tags) }
          : {}),
        ...(data.banner !== undefined
          ? { banner: data.banner }
          : {}),
      },
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
    const postExists =
      await prisma.post.findUnique({
        where: { id },
        select: { id: true },
      });

    if (!postExists) {
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

  async like(id: number, userId: number) {
    const postExists =
      await prisma.post.findUnique({
        where: { id },
        select: { id: true },
      });

    if (!postExists) {
      throw new Error("Post não encontrado");
    }

    await prisma.like.upsert({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
      update: {},
      create: {
        userId,
        postId: id,
      },
    });

    return {
      message: "Post curtido com sucesso",
    };
  }

  async unlike(id: number, userId: number) {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });

    if (!like) {
      throw new Error(
        "Este post ainda não foi curtido",
      );
    }

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });

    return {
      message: "Curtida removida com sucesso",
    };
  }
}
