import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;