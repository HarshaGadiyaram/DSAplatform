import bodyParser from "body-parser";
import express, { Express } from "express";

import bullBoardAdapter from "./config/bullBoardConfig";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import { submission_queue } from "./utils/constants";
import SampleWorker from "./workers/SampleWorker";
import SubmissionWorker from "./workers/SubmissionWorker";

const app: Express = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/api", apiRouter);
app.use("/ui", bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at *:${serverConfig.PORT}`);
  console.log(
    `BullBoard dashboard running on: http://localhost:${serverConfig.PORT}/ui`
  );

  SampleWorker("SampleQueue");
  SubmissionWorker(submission_queue);
});
