import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { promises as fsPromises } from "node:fs";
import express from "express";
import multer from "multer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

let indexHtml;
let indexJs;
let sourceMaps;

Promise.all([
  fsPromises.readFile(__dirname + "/dist/index.html", "utf8"),
  fsPromises.readFile(__dirname + "/dist/27sept.ed56ae4a.js", "utf8"),
  fsPromises.readFile(__dirname + "/dist/27sept.ed56ae4a.js.map", "utf8"),
])
  .then(([htmlData, jsData, smData]) => {
    indexHtml = htmlData.toString();
    indexJs = jsData.toString();
    sourceMaps = smData.toString();

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

app.get("/27sept.ed56ae4a.js", (req, res) => {
  res.set("Content-Type", "application/javascript");
  res.send(indexJs);
});

app.get("/27sept.ed56ae4a.js.map", (req, res) => {
  // res.set("Content-Type", "application/javascript");
  res.send(indexJs);
});
