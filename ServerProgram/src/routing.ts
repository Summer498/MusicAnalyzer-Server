import { default as fs } from "fs";
import { default as path } from "path";
import { default as express, NextFunction, Request, Response } from "express";
import { default as multer } from "multer";
import { default as url } from "url";
import { _throw, assertNonNullable as NN } from "./stdlib";

export const app = express();
export const CWD = process.cwd();
const POST_DATA_PATH = `${CWD}/posted`;
const POST_API_PATH = `html/api.js`;

export const upload = multer({ dest: POST_DATA_PATH });  // multer が POST_DATA_PATH にファイルを作成

export const send404NotFound = (req: Request, res: Response) => {
  res.status(404).send("404: Not Found...");
};
export const send300Redirect = (res: Response, pathname: string) => {
  res.redirect(300, `${path.dirname(pathname)}`);
};

export const sendFile = (req: Request, res: Response, fullpath: string) => {
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

export const sendRequestedFile = (req: Request, res: Response) => {
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

export const handlePostRequest = (req: Request, res: Response, next: NextFunction) => {
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
};
