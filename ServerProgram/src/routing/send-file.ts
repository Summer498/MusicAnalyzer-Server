import { default as fs } from "fs";
import { Request, Response } from "express";
import { _throw } from "../stdlib";
import { send404NotFound } from "./send-404-not-found";

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
