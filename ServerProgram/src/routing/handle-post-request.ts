import { default as path } from "path";
import { NextFunction } from "express";
import { Request } from "express";
import { Response } from "express";
import { _throw, } from "../stdlib";
import { send301Redirect } from "./send-301-redirect";

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
