import { default as fs } from "fs";
import { default as url } from "url";
import { basename } from "path";
import { _throw, assertNonNullable as NN } from "../../stdlib";
import { sendFile } from "../../routing";
import { Request, Response } from "express";
import { HOME_DIR, HOME } from "../../constants";
import { DataDirectories } from "../data-directories";
import { analyzeMelodyFromCrepeF0, analyzeMelodyFromPYINf0, chordExtract, chordToRoman, crepe, demucs, postCrepe, postPYIN, pyin } from "./call-program";

const _loadRomanAnalysis = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);

  chordExtract(force_reanalyze, e.chord_ext);
  chordToRoman(force_reanalyze, e.chord_to_roman);
};

const loadAnalysisFromCREPE = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);
  _loadRomanAnalysis(song_name, file_path);

  demucs(force_reanalyze, e.demucs, e.separate_dir);
  crepe(force_reanalyze, e.crepe, e.crepe_tmp);
  postCrepe(force_reanalyze, e.post_crepe);
  analyzeMelodyFromCrepeF0(force_reanalyze, e.melody_analyze_crepe, e.chord_to_roman.dst);
};

const loadAnalysisFromPYIN = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);
  _loadRomanAnalysis(song_name, file_path);

  demucs(force_reanalyze, e.demucs, e.separate_dir);
  pyin(force_reanalyze, e.pyin, e.pyin_img);
  postPYIN(force_reanalyze, e.post_pyin, e.post_pyin_dir);
  analyzeMelodyFromPYINf0(force_reanalyze, e.melody_analyze_pyin, e.chord_to_roman.dst);
};

const loadAnalysis = (req: Request, res: Response, loader: (song_name: string, file_path: string) => void) => {
  const decoded_url = decodeURI(req.url);
  const req_path = decodeURI(NN(url.parse(decoded_url, true, true).pathname).replace(`/${HOME}/`, ""));
  const song_dir = req_path.replace("/analyzed/chord/roman.json", "");
  const song_name = basename(song_dir);
  // if (fs.existsSync(HOME_DIR}/${req_path}`)) { sendFile(req, res, `${HOME_DIR}/${req_path); return }


  const extensions: ["wav", "mp3", "mp4", "m4a"] = ["wav", "mp3", "mp4", "m4a"];
  const ext = extensions.find(e => fs.existsSync(`${HOME_DIR}/${song_dir}/${song_name}.${e}`));
  if (ext) { loader(song_name, ""); }
  sendFile(req, res, `${HOME_DIR}/${req_path}`);
};

export const loadRomanAnalysis = (req: Request, res: Response) => {
  console.log("/analyzed/chord/roman.json");
  loadAnalysis(req, res, _loadRomanAnalysis);
};

type F0AnalysisMode = "pYIN" | "CREPE"
export const loadMelodyAnalysis = (mode: F0AnalysisMode, req: Request, res: Response) => {
  console.log("/analyzed/melody/pyin/manalyze.json");

  if (mode === "CREPE") { loadAnalysis(req, res, loadAnalysisFromCREPE); }
  else { loadAnalysis(req, res, loadAnalysisFromPYIN); }
};
