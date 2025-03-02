import { default as multer } from "multer";
import { _throw, assertNonNullable as NN } from "./src/stdlib";
import { handlePostRequest, listUpGTTMExample, send404HTML, send404NotFound, sendFile, sendRequestedFile } from "./src/routing";
import { NextFunction, Request, Response } from "express";
import { existsSync, default as fs } from "fs";
import { app, HOME_DIR, HOME } from "./src/constants";
import { execSync } from "child_process";
import { default as url } from "url";
import { basename } from "path";

const PORT = 3000;
const POST_DATA_PATH = `${HOME_DIR}/posted`;

const upload = multer({ dest: POST_DATA_PATH });  // multer が POST_DATA_PATH にファイルを作成

const main = (argv: string[]) => {
  // URLの部分が一致するもののうち一番上にある関数の処理をする
  app.get("*/analyzed/chord/roman.json", (req: Request, res: Response) => {
    console.log("*/analyzed/chord/roman.json");
    const decoded_url = decodeURI(req.url);
    const req_path = decodeURI(NN(url.parse(decoded_url, true, true).pathname).replace(`/${HOME}/`, ""));
    const song_dir = req_path.replace("/analyzed/chord/roman.json", "");
    const song_name = basename(song_dir);
    if (!fs.existsSync(`${HOME_DIR}/${req_path}`)) {
      const extensions: ("wav" | "mp3" | "mp4" | "m4a")[]
        = ["wav", "mp3", "mp4", "m4a"];
      const ext = extensions.find(e => {
        return existsSync(`${HOME_DIR}/${song_dir}/${song_name}.${e}`);
      });
      console.log(ext);
      if (ext) {
        console.log(`./ranalyze.sh -q ${HOME_DIR}/${song_dir}/${song_name}.${ext}`);
        const res = execSync(`./ranalyze.sh -q ${HOME_DIR}/${song_dir}/${song_name}.${ext}`);
        console.log(res);
      }
    }
    sendFile(req, res, `${HOME_DIR}/${req_path}`);
  });
  app.get("/MusicAnalyzer-server/api/gttm-example/", listUpGTTMExample);
  app.post("/*",
    upload.single("upload"),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.file) {
        const decoded_name = Buffer.from(req.file.originalname, "latin1").toString("utf8");
        fs.renameSync(req.file.path, `${POST_DATA_PATH}/${decoded_name}`);
      }
      next();
    },
    handlePostRequest
  );
  app.get("/*", sendRequestedFile);
  app.post("*.html", send404HTML);
  app.get("*.html", send404HTML);
  app.post("*", send404NotFound);
  app.get("*", send404NotFound);

  const server = app.listen(PORT, () => {
    server || _throw(TypeError("Error: Server is null"));
    const address = NN(server.address());
    if (typeof address == "string") { console.log(`Server listening at address ${address}`); return; }
    const port = address.port;
    console.log(`Server listening at ${address.address}:${port}`);
  });
};
main(process.argv);
