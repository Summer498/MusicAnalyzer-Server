import { default as url } from "url";
import { existsSync } from "fs";
import { basename } from "path";
import { sendFile } from "../../routing";
import { Request, Response } from "express";
import { ROOT } from "../../constants";
import { DataDirectories } from "../data-directories";
import { analyzeMelodyFromCrepeF0, analyzeMelodyFromPYINf0, chordExtract, chordToRoman, crepe, demucs, postCrepe, postPYIN, pyin } from "./call-program";

const _loadRomanAnalysis = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);

  chordExtract(force_reanalyze, e.chord_ext);
  chordToRoman(force_reanalyze, e.chord_to_roman);
};

const _loadAnalysisFromCREPE = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);
  _loadRomanAnalysis(song_name, file_path);

  demucs(force_reanalyze, e.demucs, e.separate_dir);
  crepe(force_reanalyze, e.crepe, e.crepe_tmp);
  postCrepe(force_reanalyze, e.post_crepe);
  analyzeMelodyFromCrepeF0(force_reanalyze, e.melody_analyze_crepe, e.chord_to_roman.dst);
};

const _loadAnalysisFromPYIN = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);
  _loadRomanAnalysis(song_name, file_path);

  demucs(force_reanalyze, e.demucs, e.separate_dir);
  pyin(force_reanalyze, e.pyin, e.pyin_img);
  postPYIN(force_reanalyze, e.post_pyin, e.post_pyin_dir);
  analyzeMelodyFromPYINf0(force_reanalyze, e.melody_analyze_pyin, e.chord_to_roman.dst);
};

export const loadRomanAnalysis = (req: Request, res: Response) => {
  console.log("/analyzed/chord/roman.json");
  const pathname = url.parse(req.url, true, true).pathname;
  if (pathname === null) { throw new Error(`pathname was null`); };
  const song_dir = pathname.replace("/analyzed/chord/roman.json", "");
  const song_name = basename(song_dir);

  const extensions: ["wav", "mp3", "mp4", "m4a"] = ["wav", "mp3", "mp4", "m4a"];
  const ext = extensions.find(e => existsSync(decodeURI(`${ROOT}${song_dir}/${song_name}.${e}`)));
  if (ext) { _loadRomanAnalysis(song_name, ""); }
  sendFile(req, res, `${ROOT}${pathname}`);
};

export const loadAnalysisFromCrepe = (req: Request, res: Response) => {
  console.log("/analyzed/melody/crepe/manalyze.json");
  const pathname = url.parse(req.url, true, true).pathname;
  if (pathname === null) { throw new Error(`pathname was null`); };
  const song_dir = pathname.replace("/analyzed/melody/crepe/manalyze.json", "");
  const song_name = basename(song_dir);

  const extensions: ["wav", "mp3", "mp4", "m4a"] = ["wav", "mp3", "mp4", "m4a"];
  const ext = extensions.find(e => existsSync(decodeURI(`${ROOT}${song_dir}/${song_name}.${e}`)));
  if (ext) { _loadAnalysisFromCREPE(song_name, ""); }
  sendFile(req, res, `${ROOT}${pathname}`);
};

export const loadAnalysisFromPYIN = (req: Request, res: Response) => {
  console.log("/analyzed/melody/pyin/manalyze.json");
  const pathname = url.parse(req.url, true, true).pathname;
  if (pathname === null) { throw new Error(`pathname was null`); };
  const song_dir = pathname.replace("/analyzed/melody/pyin/manalyze.json", "");
  const song_name = basename(song_dir);

  const extensions: ["wav", "mp3", "mp4", "m4a"] = ["wav", "mp3", "mp4", "m4a"];
  const ext = extensions.find(e => existsSync(decodeURI(`${ROOT}${song_dir}/${song_name}.${e}`)));
  if (ext) { _loadAnalysisFromPYIN(song_name, ""); }
  sendFile(req, res, `${ROOT}${pathname}`);
};
