import { Request, Response } from "express";
import { _throw } from "../stdlib";
import { send404NotFound } from "./send-404-not-found";
import { existsSync } from "fs";
import * as path from "path";

const ROOT = "/var/www/"; // Define the root directory

export const sendFile = (req: Request, res: Response, fullpath: string) => {
  const normalizedPath = path.resolve(ROOT, decodeURI(fullpath));
  if (!normalizedPath.startsWith(ROOT)) {
    res.statusCode = 403;
    res.end();
    return;
  }
  if (existsSync(normalizedPath)) {
    return res.sendFile(normalizedPath);
  }
  console.error(`File not Found: ${normalizedPath}`);
  send404NotFound(req, res);
};
