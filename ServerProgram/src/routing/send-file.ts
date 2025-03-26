import { Request } from "express";
import { Response } from "express";
import { _throw } from "../stdlib";
import { send404NotFound } from "./send-404-not-found";
import { existsSync } from "fs";

export const sendFile = (req: Request, res: Response, fullpath: string) => {
  if (existsSync(decodeURI(fullpath))) {
    return res.sendFile(decodeURI(fullpath));
  }
  console.error(`File not Found: ${decodeURI(fullpath)}`);
  send404NotFound(req, res);
};
