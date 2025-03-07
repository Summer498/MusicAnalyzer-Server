import { default as path } from "path";
import { default as url } from "url";
import { Request, Response } from "express";
import { send301Redirect } from "./send-301-redirect";
import { sendFile } from "./send-file";
import { ROOT } from "../constants";

export const sendRequestedFile = (req: Request, res: Response) => {
  if (!req.url) { throw new TypeError(`requested URL is null`); };
  const parsed = url.parse(req.url, true, true).pathname;
  if (parsed === null) { throw new Error(`pathname was null`); }

  // caution: order is important
  if (parsed.endsWith("/index.html")) { // /path/to/index.html
    send301Redirect(res, req.url.replace(`/index.html`, `/`));
  }
  else if (parsed.endsWith(`/`)) {  // /path/to/
    sendFile(req, res, `${ROOT}${parsed}index.html`);
  }
  else if (path.extname(parsed) === "") { // /path/to
    send301Redirect(res, req.url.replace(parsed, `${parsed}/`));
  }
  else {  // /path/to/file.ext
    sendFile(req, res, `${ROOT}${parsed}`);
  }
};
