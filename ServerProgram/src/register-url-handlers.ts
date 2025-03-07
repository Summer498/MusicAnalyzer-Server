import { default as multer } from "multer";
import { default as express } from "express";
import RateLimit from "express-rate-limit";
import { handlePostRequest, listUpGTTMExample, send404HTML, send404NotFound, sendRequestedFile } from "./routing";
import { loadAnalysisFromCrepe, loadAnalysisFromPYIN, loadRomanAnalysis, renameFile } from "./handle-analyzed-data";
import { POST_DATA_PATH } from "./constants";
import { _throw } from "./stdlib";

export const registerURLHandlers = (app: ReturnType<typeof express>) => {
  const upload = multer({ dest: POST_DATA_PATH });  // multer が POST_DATA_PATH にファイルを作成
  const analyzed = `/MusicAnalyzer-server/resources/**/analyzed`;

  // set up rate limiter: maximum of 100 requests per 15 minutes
  const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per windowMs
  });

  // apply rate limiter to all requests
  app.use(limiter);

  // URLの部分が一致するもののうち一番上にある関数の処理をする
  app.get(`${analyzed}/chord/roman.json`, loadRomanAnalysis);
  app.get(`${analyzed}/melody/crepe/manalyze.json`, loadAnalysisFromCrepe);
  app.get(`${analyzed}/melody/pyin/manalyze.json`, loadAnalysisFromPYIN);
  app.get("/MusicAnalyzer-server/api/gttm-example/", listUpGTTMExample);
  app.post("/*", upload.single("upload"), renameFile, handlePostRequest);
  app.get("/*", sendRequestedFile);
  app.post("*.html", send404HTML);
  app.get("*.html", send404HTML);
  app.post("*", send404NotFound);
  app.get("*", send404NotFound);
};
