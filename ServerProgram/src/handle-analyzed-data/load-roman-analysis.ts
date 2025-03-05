import { default as fs } from "fs";
import { default as url } from "url";
import { basename } from "path";
import { _throw, assertNonNullable as NN } from "../stdlib";
import { sendFile } from "../routing";
import { Request, Response } from "express";
import { HOME_DIR, HOME } from "../constants";
import { detectFile } from "./detect-file";
import { runProcessWithCache } from "./run-process-with-cache";
import { DataDirectories } from "./data-directories";

const rename = (src: string, dst: string) => {
  if (fs.existsSync(dst)) { fs.rmdirSync(dst); }
  fs.renameSync(src, dst);
};

const _loadRomanAnalysis = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);
  detectFile(e.chord_ext_src);
  runProcessWithCache(force_reanalyze, e.chord_ext_dst, `python -m chordExtract "${e.chord_ext_src}" "${e.chord_ext_dst}"`);

  detectFile(e.chord_to_roman_src);
  runProcessWithCache(true, e.chord_to_roman_dst, `node ./packages/chord-analyze-cli < "${e.chord_to_roman_src}" > "${e.chord_to_roman_dst}"`);

  // execSync(`./ranalyze.sh -q ${HOME_DIR}/${song_dir}/${song_name}.${ext}`);
};

const _loadAnalysisFromCREPE = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);
  detectFile(e.crepe_src);
  rename(e.separate_dir, e.demucs_dst);
  runProcessWithCache(force_reanalyze, e.crepe_dst, `"python -m crepe "${e.crepe_src}" >&2"`);
  rename(e.crepe_dst, e.tmp_dst);

  detectFile("$post_crepe_src");
  runProcessWithCache(force_reanalyze, e.post_crepe_dst, `python -m post-crepe "$post_crepe_src" -o "${e.post_crepe_dst}"`);

  detectFile(e.melody_analyze_crepe_src);
  detectFile(e.melody_analyze_chord_src);
  runProcessWithCache(force_reanalyze, e.melody_analyze_dst, `node ./packages/melody-analyze-cli -m "${e.melody_analyze_crepe_src}" -r "${e.melody_analyze_chord_src}" -o "${e.melody_analyze_dst}" --sampling_rate 100`);
};

const _loadAnalysisFromPYIN = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);
  detectFile(e.pyin_src);
  runProcessWithCache(force_reanalyze, e.pyin_dst, `python -m pyin "${e.pyin_src}" --fmin 128 --fmax 1024 -o "${e.pyin_dst}"`);
  runProcessWithCache(force_reanalyze, e.img_dst, `python -m pyin2img "${e.img_src}" --audio_file "${e.pyin_src}" -o "${e.img_dst}"`);

  detectFile(e.post_pyin_src);
  runProcessWithCache(force_reanalyze, e.post_pyin_dst, `node ./packages/post-pyin "${e.post_pyin_src}" "$(dirname "${e.post_pyin_dst}")"`);

  detectFile(e.melody_analyze_pyin_src);
  detectFile(e.melody_analyze_chord_src);
  const sr = 22050 / 1024;
  runProcessWithCache(force_reanalyze, e.melody_analyze_dst, `node ./packages/melody-analyze-cli -m "${e.melody_analyze_pyin_src}" -r "${e.melody_analyze_chord_src}" -o "${e.melody_analyze_dst}" --sampling_rate ${sr}`);
};

type F0AnalysisMode = "pYIN" | "CREPE"
const _loadMelodyAnalysis = (mode: F0AnalysisMode, song_name: string, file_path: string) => {
  const e = new DataDirectories(song_name, file_path);
  _loadRomanAnalysis(song_name, file_path);
  detectFile(e.demucs_src);
  runProcessWithCache(false, e.separate_dir, `python -m demucs -d cuda "${e.demucs_src}" >&2"`);
  rename(e.separate_dir, e.demucs_dst);

  if (mode === "CREPE") { _loadAnalysisFromCREPE(song_name, file_path); }
  else if (mode === "pYIN") { _loadAnalysisFromPYIN(song_name, file_path); }
  else {
    throw new Error(`Invalid mode reserved (${mode})`);
  }
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
