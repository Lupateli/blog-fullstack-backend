async create(req: Request, res: Response) {
  try {
    const data = await service.create({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      banner: req.file?.filename,
      authorId: req.userId,
    });

    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({
      message: "Erro ao criar post",
    });
  }
}