import { default as fs } from "fs";
import { default as url } from "url";
import { basename } from "path";
import { _throw, assertNonNullable as NN } from "../stdlib";
import { sendFile } from "../routing";
import { Request, Response } from "express";
import { HOME_DIR, HOME } from "../constants";
import { detectFile } from "./detect-file";
import { runProcessWithCache } from "./run-process-with-cache";
import { DataDirectories, Directories } from "./data-directories";

const rename = (src: string, dst: string) => {
  if (fs.existsSync(dst)) { fs.rmdirSync(dst); }
  fs.renameSync(src, dst);
};

const chordExtract = (force: boolean, directories: Directories) => {
  const e = directories;
  detectFile(e.src);
  runProcessWithCache(force, e.dst, `python -m chordExtract "${e.src}" "${e.dst}"`);
};

const chordToRoman = (force: boolean, directories: Directories) => {
  const e = directories;
  detectFile(e.src);
  runProcessWithCache(true, e.dst, `node ./packages/chord-analyze-cli < "${e.src}" > "${e.dst}"`);
};

const crepe = (force: boolean, directories: Directories, tmp: string) => {
  const e = directories;
  detectFile(e.src);
  runProcessWithCache(force, e.dst, `"python -m crepe "${e.src}" >&2"`);
  rename(e.dst, tmp);
};

const postCrepe = (force: boolean, directories: Directories) => {
  const e = directories;
  detectFile("$post_crepe.src");
  runProcessWithCache(force, e.dst, `python -m post-crepe "${e.src}" -o "${e.dst}"`);
};

const analyzeMelodyFromCrepeF0 = (force: boolean, directories: Directories, chord_src: string) => {
  const e = directories;
  detectFile(e.src);
  detectFile(chord_src);
  runProcessWithCache(force, e.dst, `node ./packages/melody-analyze-cli -m "${e.src}" -r "${chord_src}" -o "${e.dst}" --sampling_rate 100`);
};

const _loadRomanAnalysis = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);

  chordExtract(force_reanalyze, e.chord_ext);
  chordToRoman(force_reanalyze, e.chord_to_roman);
};

const loadAnalysisFromCREPE = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);
  crepe(force_reanalyze, e.crepe, e.crepe_tmp);
  postCrepe(force_reanalyze, e.post_crepe);
  analyzeMelodyFromCrepeF0(force_reanalyze, e.melody_analyze_crepe, e.chord_to_roman.dst);
};

const pyin = (force: boolean, directories: Directories, img_dir: Directories) => {
  const e = directories;
  detectFile(e.src);
  runProcessWithCache(force, e.dst, `python -m pyin "${e.src}" --fmin 128 --fmax 1024 -o "${e.dst}"`);
  runProcessWithCache(force, img_dir.dst, `python -m pyin2img "${img_dir.src}" --audio_file "${e.src}" -o "${img_dir.dst}"`);

};

const postPYIN = (force: boolean, directories: Directories, post_pyin_dir: string) => {
  const e = directories;
  detectFile(e.src);
  runProcessWithCache(force, e.dst, `node ./packages/post-pyin "${e.src}" "${post_pyin_dir}"`);
};

const analyzeMelodyFromPYINf0 = (force: boolean, directories: Directories, chord_src: string) => {
  const e = directories;
  detectFile(e.src);
  detectFile(chord_src);
  const sr = 22050 / 1024;
  runProcessWithCache(force, e.dst, `node ./packages/melody-analyze-cli -m "${e.src}" -r "${chord_src}" -o "${e.dst}" --sampling_rate ${sr}`);
};

const loadAnalysisFromPYIN = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);
  pyin(force_reanalyze, e.pyin, e.pyin_img);
  postPYIN(force_reanalyze, e.post_pyin, e.post_pyin_dir);
  analyzeMelodyFromPYINf0(force_reanalyze, e.melody_analyze_pyin, e.chord_to_roman.dst);
};

const demucs = (force_reanalyze: boolean, directories: Directories, separate_dir: string) => {
  const e = directories;
  detectFile(e.src);
  runProcessWithCache(false, separate_dir, `python -m demucs -d cuda "${e.src}" >&2"`);
  rename(separate_dir, e.dst);
};

type F0AnalysisMode = "pYIN" | "CREPE"
const _loadMelodyAnalysis = (mode: F0AnalysisMode, song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);
  _loadRomanAnalysis(song_name, file_path);

  demucs(force_reanalyze, e.demucs, e.separate_dir);
  if (mode === "CREPE") { loadAnalysisFromCREPE(song_name, file_path); }
  else if (mode === "pYIN") { loadAnalysisFromPYIN(song_name, file_path); }
  else { throw new Error(`Invalid mode reserved (${mode})`); }
};

export const loadRomanAnalysis = (req: Request, res: Response) => {
  console.log("*/analyzed/chord/roman.json");
  const decoded_url = decodeURI(req.url);
  const req_path = decodeURI(NN(url.parse(decoded_url, true, true).pathname).replace(`/${HOME}/`, ""));
  const song_dir = req_path.replace("/analyzed/chord/roman.json", "");
  const song_name = basename(song_dir);
  // if (fs.existsSync(HOME_DIR}/${req_path}`)) { sendFile(req, res, `${HOME_DIR}/${req_path); return }


  const extensions: ["wav", "mp3", "mp4", "m4a"] = ["wav", "mp3", "mp4", "m4a"];
  const ext = extensions.find(e => fs.existsSync(`${HOME_DIR}/${song_dir}/${song_name}.${e}`));
  if (ext) { _loadRomanAnalysis(song_name, ""); }
  sendFile(req, res, `${HOME_DIR}/${req_path}`);
};

export const loadMelodyAnalysis = (mode: F0AnalysisMode, req: Request, res: Response) => {
  console.log("*/analyzed/melody/pyin/manalyze.json");
  const decoded_url = decodeURI(req.url);
  const req_path = decodeURI(NN(url.parse(decoded_url, true, true).pathname).replace(`/${HOME}/`, ""));
  const song_dir = req_path.replace("/analyzed/chord/roman.json", "");
  const song_name = basename(song_dir);
  // if (fs.existsSync(HOME_DIR}/${req_path}`)) { sendFile(req, res, `${HOME_DIR}/${req_path); return }


  const extensions: ["wav", "mp3", "mp4", "m4a"] = ["wav", "mp3", "mp4", "m4a"];
  const ext = extensions.find(e => fs.existsSync(`${HOME_DIR}/${song_dir}/${song_name}.${e}`));
  if (ext) { _loadMelodyAnalysis(mode, song_name, ""); }
  sendFile(req, res, `${HOME_DIR}/${req_path}`);
};
