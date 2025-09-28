import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { promises as fsPromises } from "node:fs";
import express from "express";
import bodyParser from "body-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

let indexHtml;
let successHtml;
let failureHtml;

Promise.all([
  fsPromises.readFile(__dirname + "/html/index.html", "utf8"),
  fsPromises.readFile(__dirname + "/html/success.html", "utf8"),
  fsPromises.readFile(__dirname + "/html/failure.html", "utf8"),
])
  .then(([indexData, successData, failureData]) => {
    indexHtml = indexData.toString();
    successHtml = successData.toString();
    failureHtml = failureData.toString();

    app.listen(8183, () => {
      console.log(`Example app listening on port 8183`);
    });
  })
  .catch((err) => console.error("Ошибка чтения файла:", err));

app.use(bodyParser.urlencoded());

app.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(indexHtml);
});

app.post("/", (req, res) => {
  res.set("Content-Type", "text/html");

  const userData = req.body;

  if (userData["input-1"] !== "hello" || userData["input-2"] !== "world") {
    res.status(400).send(failureHtml);
    return;
  }

  res.send(successHtml);
});
