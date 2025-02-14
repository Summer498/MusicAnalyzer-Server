import { default as fs } from "fs";
import { default as path } from "path";
import { default as express, NextFunction, Request, Response } from "express";
import { default as url } from "url";
import { _throw, assertNonNullable as NN } from "./stdlib";

export const app = express();
export const HOME = "/MusicAnalyzer-server";
export const HOME_DIR = `/var/www/html${HOME}`; // process.cwd();

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
  const decoded_url = decodeURI(req.url);
  const req_path = decodeURI(NN(url.parse(decoded_url, true, true).pathname).replace(HOME, ""));

  // caution: order is important
  if (req_path.endsWith("/index.html")) { // /path/to/index.html
    const dirname = path.dirname(req_path);
    send301Redirect(res, decoded_url.replace(`${dirname}/index.html`, `${dirname}/`));
  }
  else if (req_path.endsWith(`/`)) {  // /path/to/
    sendFile(req, res, `${HOME_DIR}${req_path}index.html`);
  }
  else if (path.extname(req_path) === "") { // /path/to
    send301Redirect(res, decoded_url.replace(req_path, `${req_path}/`));
  }
  else {  // /path/to/file.ext
    sendFile(req, res, `${HOME_DIR}${req_path}`);
  }
};

const getDirectoryContents = (dir_path: string) => new Promise((resolve, reject) => {
  fs.readdir(dir_path, (err, files) => {
    if (err) { return reject(err); }
    else { resolve(files); }
  });
});

export const listUpGTTMExample = async (req: Request, res: Response) => {
  req.url || _throw(TypeError(`requested URL is null`));
  req.url === "/MusicAnalyzer-server/api/gttm-example/"
    || _throw(EvalError(`function handleHierarchicalAnalysisSample requires the url ends with '/'`));

  // json にリストを載せて返す
  const read_dir = `${HOME_DIR}/resources/gttm-example/`;
  try {
    const files = await getDirectoryContents(read_dir);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: `Failed to read directory contents of ${read_dir}` });
  }
};

const latin1toUtf8 = (latin1: string) => Buffer.from(latin1, "latin1").toString("utf8");

export const handlePostRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.file === undefined) { console.log(`File uploaded on "undefined", "undefined"`); }
  else {
    const filepath = req.file.path;
    const originalname = latin1toUtf8(req.file.originalname);
    console.log(`File uploaded on ${filepath}. original name: (${originalname})`);
  }
  const tune_parameter = req.file ? `?tune=${path.parse(encodeURI(latin1toUtf8(req.file.originalname))).name}` : "";
  send301Redirect(res, req.url + tune_parameter);
};
