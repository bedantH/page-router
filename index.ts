import { createServer } from "http";
import * as fs from "fs";

const dir = "./pages";
let pageDir: {
  [key: string]: string;
} = {};

fs.readdir(dir, (err, files) => {
  if (err) console.error("Error: ", err);

  files.forEach((file) => {
    pageDir = {
      ...pageDir,
      [file.toString().split(".")[0] === "index"
        ? "/"
        : `/${file.toString().split(".")[0]}`]: file,
    };
  });

  pageDir = pageDir;
});

createServer((req, res) => {
  const tempPages = pageDir;

  if (req.url !== "/favicon.ico") {
    fs.readFile(
      `./pages/${tempPages[req.url || "./pages/404.html"]}`,
      (err, data) => {
        if (err) console.error("Error: ", err);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      }
    );
  }
}).listen(3000);
