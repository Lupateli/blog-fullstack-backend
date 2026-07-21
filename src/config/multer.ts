import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, "uploads");
  },

  filename: (_, file, callback) => {
    const hash = crypto.randomBytes(10).toString("hex");

    const filename = `${hash}-${file.originalname}`;

    callback(null, filename);
  },
});

export default multer({
  storage,
});