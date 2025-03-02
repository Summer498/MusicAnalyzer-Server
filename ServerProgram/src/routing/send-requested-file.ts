import { default as path } from "path";
import { Request, Response } from "express";
import { default as url } from "url";
import { _throw, assertNonNullable as NN } from "../stdlib";
import { send301Redirect } from "./send-301-redirect";
import { sendFile } from "./send-file";
import { HOME, HOME_DIR } from "../constants";

export const sendRequestedFile = (req: Request, res: Response) => {
  req.url || _throw(TypeError(`requested URL is null`));
  const decoded_url = decodeURI(req.url);
  const parsed = NN(url.parse(decoded_url, true, true).pathname);
  const replaced = parsed.replace(`/${HOME}/`, "");
  const req_path = decodeURI(replaced);
  // caution: order is important
  if (req_path.endsWith("/index.html")) { // /path/to/index.html
    const dirname = path.dirname(`${req_path}`);
    send301Redirect(res, decoded_url.replace(`${dirname}/index.html`, `${dirname}/`));
  }
  else if (req_path.endsWith(`/`)) {  // /path/to/
    sendFile(req, res, `${HOME_DIR}/${req_path}index.html`);
  }
  else if (path.extname(req_path) === "") { // /path/to
    send301Redirect(res, decoded_url.replace(req_path, `${req_path}/`));
  }
  else {  // /path/to/file.ext
    sendFile(req, res, `${HOME_DIR}/${req_path}`);
  }
};
