import { Response } from "express";
import { _throw  } from "../stdlib";

const isLocalUrl = (url: string) => {
  try {
    return new URL(url, "https://example.com").origin === "https://example.com";
  } catch (e) {
    return false;
  }
};

export const send301Redirect = (res: Response, pathname: string) => {
  if (isLocalUrl(pathname)) {
    res.redirect(301, pathname);
  } else {
    res.redirect(301, "/");
  }
};
