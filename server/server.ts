import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import {router as weatherApi} from './routes/weatherRouter';
dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/api", weatherApi);

app.get("/", async (req: Request, res: Response) => {
  res.send("gbg-weather-server is running.")
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});