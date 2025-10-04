import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createReadStream, promises as fsPromises, stat } from "node:fs";
import express from "express";
import multer from "multer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

let indexHtml;

fsPromises.readFile(__dirname + "/dist/index.html", "utf8")
  .then((htmlData) => {
    indexHtml = htmlData.toString();

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

app.get("/assets/:file", (req, res) => {
  const fileName = req.params.file;
  const filePath = join(__dirname, "dist", fileName);

  stat(filePath, (err, stats) => {
    if (err) {
      return res.status(404).send("Файл не найден");
    }

     res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
     res.setHeader("Content-Length", stats.size);

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      res.status(500).send("Ошибка при чтении файла");
    });
  });
});