import { _throw, assertNonNullable as NN } from "./src/stdlib";
import { app, CWD, send404NotFound, sendFile, sendRequestedFile, upload } from "./src/routing";

const HOST_NAME = '127.0.0.1';
const PORT = 3000;
const HOME_DIR = `${HOST_NAME}:${PORT}`;
const POST_API_PATH = `html/api.js`;


const main = (argv: string[]) => {
  // URLの部分が一致するもののうち一番上にある関数の処理をする
  app.post("/*", upload.single("upload"), function (req, res, next) {
    // CAUTION: upload.fields の中で指定していない name は受け付けなくなる.
    // ファイルの処理
    if (req.file == undefined) { console.log(`File uploaded on "undefined", "undefined"`); }
    else {
      const filepath = req.file.path;
      const originalname = req.file.originalname;
      console.log(`File uploaded on ${filepath} ${originalname}`);
    }
    sendRequestedFile(req, res);
    sendFile(req, res, `${CWD}/${POST_API_PATH}`);  // 失敗: api.js の中身クライアント側でが実行されていないようだ
  });

  app.get("/*", sendRequestedFile);
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
