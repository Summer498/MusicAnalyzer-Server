import { default as fs } from "fs";
import { NextFunction, Request, Response } from "express";
import { _throw } from "../stdlib";
import { POST_DATA_PATH } from "../constants";

export const renameFile = (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    const decoded_name = Buffer.from(req.file.originalname, "latin1").toString("utf8");
    fs.renameSync(req.file.path, `${POST_DATA_PATH}/${decoded_name}`);
  }
  next();
};
