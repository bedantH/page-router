import { createServer } from "http";
import * as fs from "fs";

const dir = "./pages";
let pageDir: {
  [key: string]: string;
} = {};

fs.readdir(dir, (err, files) => {
  if (err) console.error("Error (root): ", err);

  files.forEach((file) => {
    if (file) {
      fs.stat(
        `${dir}/${file}`,
        (_err: NodeJS.ErrnoException | null, stats: fs.Stats) => {
          if (stats.isDirectory()) {
            fs.readdir(`${dir}/${file}`, (err, files) => {
              if (err) console.error("Error (isDir): ", err);

              files.forEach((fs) => {
                if (fs.toString().split(".")[0] === "index") {
                  pageDir = {
                    ...pageDir,
                    [`/${file}`]: `/${file}/index.html`,
                  };
                } else {
                  pageDir = {
                    ...pageDir,
                    [`/${file}/${
                      fs.toString().split(".")[0]
                    }`]: `/${file}/${fs}`,
                  };
                }
              });
            });
          } else {
            pageDir = {
              ...pageDir,
              [file.toString().split(".")[0] === "index"
                ? "/"
                : `/${file.toString().split(".")[0]}`]: file,
            };
          }
        }
      );
    }
  });

  pageDir = pageDir;
});

createServer((req, res) => {
  const tempPages = pageDir;

  if (req.url !== "/favicon.ico") {
    fs.readFile(
      `./pages/${tempPages[req.url || ""] || "/404.html"}`,
      (err, data) => {
        if (err) console.error("Error (Server): ", err);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      }
    );
  }
}).listen(3000);
console.log("💻 Server: Successfully Running at 3000, serving: /");