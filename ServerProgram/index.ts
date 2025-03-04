import { default as multer } from "multer";
import { _throw, assertNonNullable as NN } from "./src/stdlib";
import { handlePostRequest, listUpGTTMExample, send404HTML, send404NotFound, sendFile, sendRequestedFile } from "./src/routing";
import { NextFunction, Request, Response } from "express";
import { existsSync, default as fs } from "fs";
import { app, HOME_DIR, HOME } from "./src/constants";
import { execSync } from "child_process";
import { default as url } from "url";
import { basename, dirname } from "path";

const PORT = 3000;
const POST_DATA_PATH = `${HOME_DIR}/posted`;

const upload = multer({ dest: POST_DATA_PATH });  // multer が POST_DATA_PATH にファイルを作成

const detectFile = (dst: string) => {
  if (!existsSync(dst)) {
    console.error(`file ${dst} not exist`);
  }
};
const makeNewDir = (
  dst_dir: string
) => {
  if(! dirname(dst_dir)){
    fs.mkdirSync(dst_dir);
    fs.chmodSync(dst_dir,0o775);
  }
};
const runProcessWithCache = (
  force: boolean,
  dst: string,
  process: string
) => {
  if (force === false && existsSync(dst)) {
    console.log(`${dst} already exist`);
  }
  else {
    makeNewDir(dirname(dst));
    console.log(process);
    execSync(process);
    fs.chmodSync(dst, 0o775);
  }
};
const main = (argv: string[]) => {
  // URLの部分が一致するもののうち一番上にある関数の処理をする
  app.get("*/analyzed/chord/roman.json", (req: Request, res: Response) => {
    console.log("*/analyzed/chord/roman.json");
    const decoded_url = decodeURI(req.url);
    const req_path = decodeURI(NN(url.parse(decoded_url, true, true).pathname).replace(`/${HOME}/`, ""));
    const song_dir = req_path.replace("/analyzed/chord/roman.json", "");
    const song_name = basename(song_dir);
    // if (fs.existsSync(`${HOME_DIR}/${req_path}`)) { sendFile(req, res, `${HOME_DIR}/${req_path}`); return }


    const extensions: ("wav" | "mp3" | "mp4" | "m4a")[]
      = ["wav", "mp3", "mp4", "m4a"];
    const ext = extensions.find(e => {
      return existsSync(`${HOME_DIR}/${song_dir}/${song_name}.${e}`);
    });
    if (ext) {
      const force_reanalyze = false;
      const filepath = "";
      const chord_ext_src = filepath;
      const chord_ext_dst = `./resources/${song_name}/analyzed/chord/chords.json`;
      detectFile(`${chord_ext_src}`);
      runProcessWithCache(false, chord_ext_dst, `python -m chordExtract \"${chord_ext_src}\" \"${chord_ext_dst}\"`);

      const chord_to_roman_src = chord_ext_dst;
      const chord_to_roman_dst = `./resources/${song_name}/analyzed/chord/roman.json`;
      detectFile(`${chord_to_roman_src}`);
      runProcessWithCache(true, chord_to_roman_dst, `node ./packages/chord-analyze-cli < \"${chord_to_roman_src}\" > \"${chord_to_roman_dst}\"`);

      // execSync(`./ranalyze.sh -q ${HOME_DIR}/${song_dir}/${song_name}.${ext}`);
    }
    sendFile(req, res, `${HOME_DIR}/${req_path}`);
  });
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
