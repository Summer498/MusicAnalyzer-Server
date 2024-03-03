import fs from "fs";
import path from "path";
import express from "express";
import multer from "multer";
import url from "url";
import { _throw, assertNonNullable as NN } from "../packages/StdLib";
const app = express();

const HOST_NAME = '127.0.0.1';
const PORT = 3000;
const HOME_DIR = `${HOST_NAME}:${PORT}`;
const CWD = process.cwd();
const POST_DATA_PATH = `${CWD}/posted`;
const POST_API_PATH = `html/api.js`;

const upload = multer({ dest: POST_DATA_PATH });  // multer が POST_DATA_PATH にファイルを作成

const send404NotFound = (req: any, res: any) => {
  res.status(404).send("404: Not Found...");
};
const send300Redirect = (res: any, pathname: string) => {
  res.redirect(300, `${path.dirname(pathname)}`);
};

const sendFile = (req: any, res: any, fullpath: string) => {
  if (!fs.existsSync(fullpath)) {
    const err = `File not Found: ${fullpath}`;
    console.error(err);
    res.status(404).send(`<html lang="ja"><head><meta http-equiv="content-lang" content="ja" charset="utf-8"><title>404 Not Found</title></head><h1>404 Not Found...<h1><p>${url.parse(req.url, true, true).pathname} is not on server directory<p></html>`);
  }
  else {
    res.sendFile(fullpath);
    console.log(`Accessed on ${fullpath}`);
  }
};

const sendRequestedFile = (req: any, res: any) => {
  req.url || _throw(TypeError(`requested URL is null`));
  const pathname = NN(url.parse(req.url, true, true).pathname);
  const filepath = path.extname(pathname) == "" ? pathname + "/index.html" : pathname;
  const fullpath = `${CWD}/html${filepath}`;
  // パスの指定先が見つからないとき
  if (0) { }
  else if (path.basename(pathname) == "index.html") {
    send300Redirect(res, pathname);
  }
  else {
    sendFile(req, res, fullpath);
  }
};

const main = (argv: string[]) => {
  // URLの部分が一致するもののうち一番上にある関数の処理をする
  app.post("/*", upload.single("upload"), function (req, res, next) {
    // CAUTION: upload.fields の中で指定していない name は受け付けなくなる.
    // ファイルの処理
    if (req.file == undefined) { console.log(`File uploaded on "undefined", "undefined"`); }
    else {
      const filepath = req.file.path;
      const originalname = req.file.originalname;
      console.log(`File uploaded on ${filepath} ${originalname}`);
    }
    sendRequestedFile(req, res);
    sendFile(req, res, `${CWD}/${POST_API_PATH}`);  // 失敗: api.js の中身クライアント側でが実行されていないようだ
  });

  app.get("/*", sendRequestedFile);
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
