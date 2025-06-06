import { chmodSync, existsSync, mkdirSync, readdir, renameSync, rmdirSync } from "fs";
import { NextFunction } from "express";
import { Request } from "express";
import { Response } from "express";
import { basename } from "path";
import { execSync } from "child_process";

import { default as multer } from "multer";
import { default as express } from "express";
import { default as path } from "path";
import { default as url } from "url";
import { default as URL } from "url";


const getDirectoryContents = (dir_path: string) => new Promise((resolve, reject) => {
  readdir(dir_path, (err, files) => {
    if (err) { return reject(err); }
    else { resolve(files); }
  });
});

const latin1toUtf8 = (latin1: string) => Buffer.from(latin1, "latin1").toString("utf8");

const handlePostRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.file === undefined) { console.log(`File uploaded on "undefined", "undefined"`); }
  else {
    const filepath = req.file.path;
    const originalname = latin1toUtf8(req.file.originalname);
    console.log(`File uploaded on ${filepath}. original name: (${originalname})`);
  }
  const tune_parameter = req.file ? `?tune=${path.parse(encodeURI(latin1toUtf8(req.file.originalname))).name}` : "";
  send301Redirect(res, req.url + tune_parameter);
};

const listUpGTTMExample = (req: Request, res: Response) => {
  if (req.url !== "/MusicAnalyzer-server/api/gttm-example/") {
    throw new EvalError(`function handleHierarchicalAnalysisSample requires the url ends with '/'`);
  }

  // json にリストを載せて返す
  const read_dir = `resources/gttm-example/`;
  try {
    getDirectoryContents(read_dir)
      .then(files => res.json(files));
  } catch (err) {
    res.status(500).json({ error: `Failed to read directory contents of ${read_dir}` });
  }
};

const send301Redirect = (res: Response, pathname: string) => {
  res.redirect(301, pathname);
};

const send404HTML = (req: Request, res: Response) => {
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

const send404NotFound = (req: Request, res: Response) => {
  res.status(404).send("404: Not Found...");
};

const sendFile = (req: Request, res: Response, fullpath: string) => {
  if (existsSync(decodeURI(fullpath))) {
    return res.sendFile(decodeURI(fullpath));
  }
  console.error(`File not Found: ${decodeURI(fullpath)}`);
  send404NotFound(req, res);
};

const sendRequestedFile = (req: Request, res: Response) => {
  if (!req.url) { throw new TypeError(`requested URL is null`); };
  const parsed = url.parse(req.url, true, true).pathname;
  if (parsed === null) { throw new Error(`pathname was null`); }

  // caution: order is important
  if (parsed.endsWith("/index.html")) { // /path/to/index.html
    send301Redirect(res, req.url.replace(`/index.html`, `/`));
  }
  else if (parsed.endsWith(`/`)) {  // /path/to/
    sendFile(req, res, `${ROOT}${parsed}index.html`);
  }
  else if (path.extname(parsed) === "") { // /path/to
    send301Redirect(res, req.url.replace(parsed, `${parsed}/`));
  }
  else {  // /path/to/file.ext
    sendFile(req, res, `${ROOT}${parsed}`);
  }
};


const _throw = <E extends Error>(e: E) => { throw e; };  // 文の式化
const assertNotNull = <T>(value: T | null, error = new TypeError("null value received")) => value !== null ? value : _throw(error);
const assertNotUndefined = <T>(value: T | undefined, error = new TypeError("undefined value received")) => value !== undefined ? value : _throw(error);
const assertNonNullable = <T>(value: T | null | undefined) => assertNotNull(assertNotUndefined(value));
const NN = assertNonNullable;

const ROOT = `/var/www/html`;
const POST_DATA_PATH = `${ROOT}/MusicAnalyzer-server/posted`;
const PORT = 3000;


const detectFile = (dst: string) => {
  const exists = existsSync(decodeURI(dst));
  if (!exists) { console.error(`file "${decodeURI(dst)}" not exist`); }
  return exists;
};

const makeNewDir = (
  dst_dir: string
) => {
  if (existsSync(decodeURI(dst_dir))) return;
  mkdirSync(decodeURI(dst_dir));
  chmodSync(decodeURI(dst_dir), 0o775);
};

interface Directories<
  S extends string | undefined,
  T extends string | undefined,
  DD extends string | undefined,
  D extends string | undefined,
> {
  src: S
  tmp: T
  dst_dir: DD
  dst: D
}

const createDirectories = <
  S extends string | undefined,
  T extends string | undefined,
  DD extends string | undefined,
  D extends string | undefined,
>(src: S, tmp: T, dst_dir: DD, dst: D): Directories<S, T, DD, D> => ({
  src,
  tmp,
  dst_dir,
  dst,
})

interface DataDirectories {
  chord: Directories<string, undefined, string, string>
  roman: Directories<string, undefined, string, string>

  demucs: Directories<string, string, string, string>

  f0_crepe: Directories<string, string, string, string>
  midi_crepe: Directories<string, undefined, string, string>
  melody_crepe: Directories<string, undefined, string, string>

  f0_pyin: Directories<string, undefined, string, string>
  pyin_img: Directories<string, undefined, string, string>
  midi_pyin: Directories<string, undefined, string, string>
  melody_pyin: Directories<string, undefined, string, string>
}

const createDataDirectories = (song_name: string, file_path: string): DataDirectories => {
  const resource = `./resources/${song_name}`;
  const analyzed = `${resource}/analyzed`;
  const chord = `${analyzed}/chord`;
  const melody = `${analyzed}/melody`;
  const demucs = `${resource}/demucs`;
  const crepe = `${melody}/crepe`;
  const pyin = `${melody}/pyin`;

  const chordDirs = createDirectories(file_path, undefined, chord, `${chord}/chords.json`);
  const romanDirs = createDirectories(chordDirs.dst, undefined, chord, `${chord}/roman.json`);

  const demucsDirs = createDirectories(file_path, `separated/htdemucs/${song_name}`, demucs, `${demucs}/vocals.wav`);

  const f0Crepe = createDirectories(demucsDirs.dst, `${crepe}/vocals.f0.csv`, crepe, `${crepe}/vocals.f0.csv`);
  const midiCrepe = createDirectories(f0Crepe.dst, undefined, crepe, `${crepe}/vocals.midi.json`);
  const melodyCrepe = createDirectories(midiCrepe.dst, undefined, crepe, `${crepe}/manalyze.json`);

  const f0Pyin = createDirectories(demucsDirs.dst, undefined, pyin, `${pyin}/vocals.f0.json`);
  const midiPyin = createDirectories(f0Pyin.dst, undefined, pyin, `${pyin}/vocals.midi.json`);
  const melodyPyin = createDirectories(midiPyin.dst, undefined, pyin, `${pyin}/manalyze.json`);
  const pyinImg = createDirectories(f0Pyin.dst, undefined, pyin, `${pyin}/vocals.f0.png`);

  return {
    chord: chordDirs,
    roman: romanDirs,

    demucs: demucsDirs,

    f0_crepe: f0Crepe,
    midi_crepe: midiCrepe,
    melody_crepe: melodyCrepe,

    f0_pyin: f0Pyin,
    pyin_img: pyinImg,
    midi_pyin: midiPyin,
    melody_pyin: melodyPyin,
  }
}

type DirectoriesWithTemp = Directories<string, string, string, string>;
type DirectoriesWithoutTemp = Directories<string, undefined, string, string>;

const debug_log = (message: string) => {
  if (false) { console.log(message) }
}

const chordExtract = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execSync(`./sh/callChordExtract.sh "${decodeURI(e.src)}" "${decodeURI(e.dst)}"`);
  }
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};

const chordToRoman = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execSync(`node ./packages/chord-analyze-cli < "${e.src}" > "${e.dst}"`)
  }
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};

const demucs = (
  force: boolean,
  directories: DirectoriesWithTemp,
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execSync(`./sh/callDemucs.sh "${decodeURI(e.src)}" "${decodeURI(e.dst)}"`);
    if (existsSync(e.tmp)) {
      if (existsSync(e.dst)) { rmdirSync(e.dst_dir) }
      renameSync(e.tmp, e.dst_dir);
    }
  }
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};

const f0ByCrepe = (
  force: boolean,
  directories: DirectoriesWithTemp,
  song_name: string,
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execSync(`./sh/callCrepe.sh "${song_name}"`);
  }
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};

const f0By_pYIN = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  img: DirectoriesWithoutTemp,
  song_name: string,
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execFileSync("sh", ["./sh/callPYIN.sh", song_name]);
    makeNewDir(img.dst_dir);
    execFileSync("sh", ["./sh/callPYIN2img.sh", song_name]);
  }
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};

const melodyAnalysisByCrepe = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  chord_src: string,
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else {
    const has_midi_src = detectFile(e.src);
    const has_chord_src = detectFile(chord_src);
    if (has_midi_src && has_chord_src) {
      makeNewDir(e.dst_dir);
      execFileSync(
        "node",
        [
          "./packages/melody-analyze-cli",
          "-m",
          e.src,
          "-r",
          chord_src,
          "-o",
          e.dst,
          "--sampling_rate",
          "100",
        ],
      );
    }
    else if (false === has_chord_src) {
      console.log(`required file ${chord_src} not exist`)
    }
    else {
      console.log(`required file ${e.src} not exist`)
    }
  }
  return true;
};

const melodyAnalysisBy_pYIN = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  chord_src: string,
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src) && detectFile(chord_src)) {
    const sr = 22050 / 1024;
    makeNewDir(e.dst_dir);
    execFileSync(
      "node",
      [
        "./packages/melody-analyze-cli",
        "-m",
        e.src,
        "-r",
        chord_src,
        "-o",
        e.dst,
        "--sampling_rate",
        `${sr}`,
      ],
    );
  }
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};

const semitonesByCrepe = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  song_name: string,
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execSync(`./sh/callPostCrepe.sh "${song_name}"`);
  }
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};

const semitonesBy_pYIN = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execFileSync("node", ["./packages/cli/post-pyin", e.src, e.dst_dir])
  }
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};

const _loadAnalysisFromCREPE = (update: boolean, song_name: string, file_path: string) => {
  const force = false;
  const e = createDataDirectories(song_name, file_path);
  chordExtract(false, e.chord);
  chordToRoman(false, e.roman);

  demucs(false, e.demucs);
  f0ByCrepe(false, e.f0_crepe, song_name);
  semitonesByCrepe(false, e.midi_crepe, song_name);
  melodyAnalysisByCrepe(update, e.melody_crepe, e.roman.dst);
};

const _loadAnalysisFromPYIN = (update: boolean, song_name: string, file_path: string) => {
  const force = false;
  const e = createDataDirectories(song_name, file_path);
  chordExtract(false, e.chord);
  chordToRoman(false, e.roman);

  demucs(false, e.demucs);
  f0By_pYIN(false, e.f0_pyin, e.pyin_img, song_name);
  semitonesBy_pYIN(false, e.midi_pyin);
  melodyAnalysisBy_pYIN(update, e.melody_pyin, e.roman.dst);
};

const _loadRomanAnalysis = (update: boolean, song_name: string, file_path: string) => {
  const force = false;
  const e = createDataDirectories(song_name, file_path);

  chordExtract(false, e.chord);
  chordToRoman(update, e.roman);
};


const loadAnalysisFromCrepe = (req: Request, res: Response) => {
  console.log("/analyzed/melody/crepe/manalyze.json");
  const url = URL.parse(req.url, true, true);
  const search = new URLSearchParams(url.search || "");
  const update = search.has("update");
  const pathname = url.pathname;
  if (pathname === null) { throw new Error(`pathname was null`); };
  const song_dir = decodeURI(pathname.replace("/analyzed/melody/crepe/manalyze.json", ""));
  const song_name = basename(song_dir);

  const extensions: ["wav", "mp3", "mp4", "m4a"] = ["wav", "mp3", "mp4", "m4a"];
  const ext = extensions.find(e => existsSync((`${ROOT}${song_dir}/${song_name}.${e}`)));
  if (ext) { _loadAnalysisFromCREPE(update, song_name, `${ROOT}${song_dir}/${song_name}.${ext}`); }
  sendFile(req, res, `${ROOT}${pathname}`);
};

const loadAnalysisFromPYIN = (req: Request, res: Response) => {
  console.log("/analyzed/melody/pyin/manalyze.json");
  const url = URL.parse(req.url, true, true);
  const search = new URLSearchParams(url.search || "");
  const update = search.has("update");
  const pathname = url.pathname;
  if (pathname === null) { throw new Error(`pathname was null`); };
  const song_dir = decodeURI(pathname.replace("/analyzed/melody/pyin/manalyze.json", ""));
  const song_name = basename(song_dir);

  const extensions: ["wav", "mp3", "mp4", "m4a"] = ["wav", "mp3", "mp4", "m4a"];
  const ext = extensions.find(e => existsSync((`${ROOT}${song_dir}/${song_name}.${e}`)));
  if (ext) { _loadAnalysisFromPYIN(update, song_name, `${ROOT}${song_dir}/${song_name}.${ext}`); }
  sendFile(req, res, `${ROOT}${pathname}`);
};

const loadRomanAnalysis = (req: Request, res: Response) => {
  console.log("/analyzed/chord/roman.json");
  const url = URL.parse(req.url, true, true);
  const search = new URLSearchParams(url.search || "");
  const update = search.has("update");
  const pathname = url.pathname;
  if (pathname === null) { throw new Error(`pathname was null`); };
  const song_dir = decodeURI(pathname.replace("/analyzed/chord/roman.json", ""));
  const song_name = basename(song_dir);

  const extensions: ["wav", "mp3", "mp4", "m4a"] = ["wav", "mp3", "mp4", "m4a"];
  const ext = extensions.find(e => existsSync((`${ROOT}${song_dir}/${song_name}.${e}`)));
  if (ext) { _loadRomanAnalysis(update, song_name, `${ROOT}${song_dir}/${song_name}.${ext}`); }
  sendFile(req, res, `${ROOT}${pathname}`);
};

const renameFile = (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    const decoded_name = Buffer.from(req.file.originalname, "latin1").toString("utf8");
    renameSync(req.file.path, `${POST_DATA_PATH}/${decoded_name}`);
  }
  next();
};



const registerURLHandlers = (app: ReturnType<typeof express>) => {
  const upload = multer({ dest: POST_DATA_PATH });  // multer が POST_DATA_PATH にファイルを作成
  const analyzed = `/MusicAnalyzer-server/resources/**/analyzed`;

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


const main = (argv: string[]) => {
  const app = express();
  registerURLHandlers(app);
  const server = app.listen(PORT, () => {
    server || _throw(TypeError("Error: Server is null"));
    const address = NN(server.address());
    if (typeof address == "string") { console.log(`Server listening at address ${address}`); return; }
    const port = address.port;
    console.log(`Server listening at ${address.address}:${port}`);
  });
};
main(process.argv);
