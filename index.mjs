import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { promises as fsPromises } from "node:fs";
import express from "express";
import multer from "multer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

let indexHtml;
let indexJs;

Promise.all([
  fsPromises.readFile(__dirname + "/static-files/index.html", "utf8"),
  fsPromises.readFile(__dirname + "/static-files/index.js", "utf8"),
])
  .then(([htmlData, jsData]) => {
    indexHtml = htmlData.toString();
    indexJs = jsData.toString();

    app.listen(8183, () => {
      console.log(`Example app listening on port 8183`);
    });
  })
  .catch((err) => console.error("Ошибка чтения файла:", err));

const formDataParser = multer();

app.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(indexHtml);
});

app.get('/index.js', (req, res) => {
  res.set("Content-Type", "application/javascript");
  res.send(indexJs);
});

app.post("/", formDataParser.none(), (req, res) => {
  res.set("Content-Type", "application/json");

  const userData = req.body;

  if (userData["input-1"] !== "hello" || userData["input-2"] !== "world") {
    res.status(400).send('{ "success": false }');
    return;
  }

  res.send('{ "success": true }');
});
