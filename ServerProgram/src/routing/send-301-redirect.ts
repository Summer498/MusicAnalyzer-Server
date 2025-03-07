import { Response } from "express";
import { _throw  } from "../stdlib";

const authorizedRedirects = [
  "/home",
  "/profile",
  "/settings"
];

const isAuthorizedRedirect = (url: string) => {
  return authorizedRedirects.includes(url);
};

export const send301Redirect = (res: Response, pathname: string) => {
  if (isAuthorizedRedirect(pathname)) {
    res.redirect(301, pathname);
  } else {
    res.redirect(301, "/");
  }
};
