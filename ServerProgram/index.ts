import { default as multer } from "multer";
import { _throw, assertNonNullable as NN } from "./src/stdlib";
import { app, handlePostRequest, HOME_DIR, listUpGTTMExample, send404HTML, send404NotFound, sendRequestedFile } from "./src/routing";
import { NextFunction, Request, Response } from "express";
import { default as fs } from "fs";

const PORT = 3000;
const POST_DATA_PATH = `${HOME_DIR}/posted`;

export const upload = multer({ dest: POST_DATA_PATH });  // multer が POST_DATA_PATH にファイルを作成

const main = (argv: string[]) => {
  // URLの部分が一致するもののうち一番上にある関数の処理をする
  app.get("/MusicAnalyzer-server/api/gttm-example/", listUpGTTMExample);
  app.post("/*",
    upload.single("upload"),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.file) {
        const decoded_name = Buffer.from(req.file.originalname, "latin1").toString("utf8");
        fs.renameSync(req.file.path, `${POST_DATA_PATH}/${decoded_name}`);
      }
      next();
    },
    handlePostRequest
  );
  app.get("/*", sendRequestedFile);
  app.post("*.html", send404HTML);
  app.get("*.html", send404HTML);
  app.post("*", send404NotFound);
  app.get("*", send404NotFound);

  const server = app.listen(PORT, () => {
    server || _throw(TypeError("Error: Server is null"));
    const address = NN(server.address());
    if (typeof address == "string") { console.log(`Server listening at address ${address}`); return; }
    const port = address.port;
    console.log(`Server listening at ${address.address}:${port}`);
  });
};
main(process.argv);
