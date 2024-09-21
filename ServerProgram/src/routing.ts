import { default as fs } from "fs";
import { default as path } from "path";
import { default as express, Request, Response } from "express";
import { default as multer } from "multer";
import { default as url } from "url";
import { _throw, assertNonNullable as NN } from "./stdlib";

export const app = express();
export const CWD = process.cwd();
const POST_DATA_PATH = `${CWD}/posted`;

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
