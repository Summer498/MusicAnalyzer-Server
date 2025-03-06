import { default as fs } from "fs";
import { default as url } from "url";
import { basename } from "path";
import { _throw, assertNonNullable as NN } from "../../stdlib";
import { sendFile } from "../../routing";
import { Request, Response } from "express";
import { HOME_DIR, HOME } from "../../constants";
import { DataDirectories } from "../data-directories";
import { chordExtract, chordToRoman, demucs, loadAnalysisFromCREPE, loadAnalysisFromPYIN } from "./call-program";

const _loadRomanAnalysis = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);

  chordExtract(force_reanalyze, e.chord_ext);
  chordToRoman(force_reanalyze, e.chord_to_roman);
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
  console.log("/analyzed/chord/roman.json");
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
  console.log("/analyzed/melody/pyin/manalyze.json");
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
