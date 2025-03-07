import { Request, Response } from "express";
import { _throw } from "../stdlib";

export const send404NotFound = (req: Request, res: Response) => {
  res.status(404).send("404: Not Found...");
};
