import express from "express"
import cors from "express"
import helmet from "helmet"
import pino from "pino";
import pinoHttp from "pino-http";

import { Router, Request, Response } from "express";

const app = express();

const logger = pino({
  level: "info",
});

const route = Router()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  req.logger = logger
  next()
})
app.use(
  pinoHttp({
    logger,
  })
)

route.get("/", (req: Request, res: Response) => {
  req.logger.info("this is a log")
  res.json({ message: "hello world Typescript" })
})

app.use(route)

app.listen(3333, () => "server running on port 3333")
