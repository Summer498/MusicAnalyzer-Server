import { Request } from "express";
import { Response } from "express";
import { default as url } from "url";
import { _throw } from "../stdlib";


export const send404HTML = (req: Request, res: Response) => {
  res.status(404).send(
    `<html lang="ja">
      <head>
        <meta http-equiv="content-lang" content="ja" charset="utf-8">
        <title>404 Not Found</title>
      </head>
      <h1>404 Not Found...<h1>
      <p>${url.parse(req.url, true, true).pathname} is not on server directory<p>
    </html>`
  );
};
