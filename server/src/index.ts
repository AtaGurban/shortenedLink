import dotenv from "dotenv";
dotenv.config();
import express from "express";
import * as http from "http";
import { Express } from "express";
import cors from "cors";
import ErrorHandlingMiddleware from "./middleware/ErrorHandlingMiddleware.ts";
import sequelize from "./db.ts";
import router from "./routes/index.ts";
import redisClient from "./service/redis/redis.ts";
import { PORT } from "./utils/envConst.ts";
import fileUpload from "express-fileupload"
const app: Express = express();
const port: number = parseInt(PORT || "8080", 10);

app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    defCharset: "utf8",
    defParamCharset: "utf8",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
const server = http.createServer(app);

app.use(ErrorHandlingMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await redisClient.connect();
    server.listen(port, async () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
