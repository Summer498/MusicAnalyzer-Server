import { default as fs } from "fs";
import { NextFunction, Request, Response } from "express";
import { _throw } from "../stdlib";
import { POST_DATA_PATH } from "../constants";
import * as path from "path";

const SAFE_ROOT = POST_DATA_PATH;

export const renameFile = (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    const decoded_name = Buffer.from(req.file.originalname, "latin1").toString("utf8");
    const newFilePath = path.resolve(SAFE_ROOT, decoded_name);
    if (!newFilePath.startsWith(SAFE_ROOT)) {
      res.status(403).send("Invalid file path");
      return;
    }
    fs.renameSync(req.file.path, newFilePath);
  }
  next();
};
