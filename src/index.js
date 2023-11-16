import express from "express";
import { route } from "./routes/index.js";
import dotenv from "dotenv";
import db from "./config/db.js";
import bodyParser from "body-parser";

const app = express();

dotenv.config();

app.use(bodyParser.json());

route(app);

app.listen(3001, async () => {
  console.log("listening on port 3000");
  await db.connect();
});
