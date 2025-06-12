import * as dotenv from "dotenv";
dotenv.config();
import * as express from "express";
import * as http from "http";
import { Express } from "express";
import * as path from "path";
import * as cors from "cors";
import ErrorHandlingMiddleware from "./middleware/ErrorHandlingMiddleware";
import sequelize from "./db";
import router from "./routes/index";
import redisClient from "./service/redis/redis";
import { PORT } from "./utils/envConst";
import * as fileUpload from "express-fileupload"
const app: Express = express();
const port: number = parseInt(PORT || "8080", 10);
const source = path.join(__dirname, 'build');
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
app.use(express.static(source));
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
      app.get("*", async (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
  } catch (error) {
    console.log(error);
  }
};

start();
