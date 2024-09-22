import { _throw, assertNonNullable as NN } from "./src/stdlib";
import { app, handlePostRequest, send404NotFound, sendRequestedFile, upload } from "./src/routing";

const HOST_NAME = '127.0.0.1';
const PORT = 3000;
const HOME_DIR = `${HOST_NAME}:${PORT}`;

const main = (argv: string[]) => {
  // URLの部分が一致するもののうち一番上にある関数の処理をする
  app.post("/*", upload.single("upload"), handlePostRequest);
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
