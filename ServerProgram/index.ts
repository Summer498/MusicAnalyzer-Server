import { _throw, assertNonNullable as NN } from "./src/stdlib";
import { app, handlePostRequest, listUpGTTMExample, send404HTML, send404NotFound, sendRequestedFile, upload } from "./src/routing";

const PORT = 3000;

const main = (argv: string[]) => {
  // URLの部分が一致するもののうち一番上にある関数の処理をする
  // app.get("/MusicAnalyzer-server/html/hierarchical-analysis-sample/", handleHierarchicalAnalysisSample);
  app.get("/MusicAnalyzer-server/api/gttm-example/", listUpGTTMExample);
  app.post("/*", upload.single("upload"), handlePostRequest);
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
