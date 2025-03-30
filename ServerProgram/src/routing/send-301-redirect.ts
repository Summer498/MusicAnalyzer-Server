import { Response } from "express";
import { _throw } from "../stdlib";

export const send301Redirect = (res: Response, pathname: string) => {
  res.redirect(301, pathname);
};
