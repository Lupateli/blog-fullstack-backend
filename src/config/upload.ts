import multer from "multer";
import path from "path";
import crypto from "crypto";

const uploadFolder = path.resolve(
  __dirname,
  "..",
  "..",
  "uploads",
  "avatars",
);

const storage = multer.diskStorage({
  destination: uploadFolder,

  filename: (
    request,
    file,
    callback,
  ) => {
    const fileHash = crypto
      .randomBytes(10)
      .toString("hex");

    const fileName = `${fileHash}-${file.originalname}`;

    callback(null, fileName);
  },
});

function fileFilter(
  request: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new Error(
        "Formato inválido. Envie uma imagem JPG, PNG ou WEBP.",
      ),
    );
  }

  callback(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});