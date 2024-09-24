import { default as fs } from "fs";
import { default as path } from "path";
import { default as express, NextFunction, Request, Response } from "express";
import { default as multer } from "multer";
import { default as url } from "url";
import { _throw, assertNonNullable as NN } from "./stdlib";

export const app = express();
const HOME = "/MusicAnalyzer-server";
const HOME_DIR = `/var/www/html${HOME}`; // process.cwd();
const POST_DATA_PATH = `${HOME_DIR}/posted`;
const POST_API_PATH = `html/api.js`;

export const upload = multer({ dest: POST_DATA_PATH });  // multer が POST_DATA_PATH にファイルを作成

export const send404HTML = (req: Request, res: Response) => {
  res.status(404).send(
    `<html lang="ja">
      <head>
        <meta http-equiv="content-lang" content="ja" charset="utf-8">
        <title>404 Not Found</title>
      </head>
      <h1>404 Not Found...<h1>
      <p>${url.parse(req.url, true, true).pathname} is not on server directory<p>
    </html>`
  );
};

export const send404NotFound = (req: Request, res: Response) => {
  res.status(404).send("404: Not Found...");
};
export const send301Redirect = (res: Response, pathname: string) => {
  res.redirect(301, pathname);
};

export const sendFile = (req: Request, res: Response, fullpath: string) => {
  if (!fs.existsSync(fullpath)) {
    const err = `File not Found: ${fullpath}`;
    console.error(err);
    send404NotFound(req, res);
  }
  else {
    res.sendFile(fullpath);
  }
};

export const sendRequestedFile = (req: Request, res: Response) => {
  req.url || _throw(TypeError(`requested URL is null`));
  const req_path = decodeURI(NN(url.parse(req.url, true, true).pathname).replace(HOME, ""));
  
  // caution: order is important
  if (req_path.endsWith("/index.html")) { // /path/to/index.html
    const dirname = path.dirname(req_path);
    send301Redirect(res, req.url.replace(`${dirname}/index.html`, `${dirname}/`));
  }
  else if (req_path.endsWith(`/`)) {  // /path/to/
    sendFile(req, res, `${HOME_DIR}${req_path}index.html`);
  }
  else if (path.extname(req_path) === "") { // /path/to
    send301Redirect(res, req.url.replace(req_path, `${req_path}/`));
  }
  else {  // /path/to/file.ext
    sendFile(req, res, `${HOME_DIR}${req_path}`);
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
  sendFile(req, res, `${HOME_DIR}/${POST_API_PATH}`);  // 失敗: api.js の中身クライアント側でが実行されていないようだ
};
