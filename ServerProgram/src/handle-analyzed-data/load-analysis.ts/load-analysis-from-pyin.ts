import { default as URL } from "url";
import { existsSync } from "fs";
import { basename } from "path";
import { sendFile } from "../../routing";
import { Request } from "express";
import { Response } from "express";
import { ROOT } from "../../constants";
import { melodyAnalysisBy_pYIN } from "./call-program";
import { chordExtract } from "./call-program";
import { chordToRoman } from "./call-program";
import { demucs } from "./call-program";
import { semitonesBy_pYIN } from "./call-program";
import { f0By_pYIN } from "./call-program";
import { DataDirectories } from "../data-directories";

const _loadAnalysisFromPYIN = (update: boolean, song_name: string, file_path: string) => {
  const force = false;
  const e = new DataDirectories(song_name, file_path);
  chordExtract(false, e.chord);
  chordToRoman(false, e.roman);

  demucs(false, e.demucs);
  f0By_pYIN(false, e.f0_pyin, e.pyin_img, song_name);
  semitonesBy_pYIN(false, e.midi_pyin);
  melodyAnalysisBy_pYIN(update, e.melody_pyin, e.roman.dst);
};

export const loadAnalysisFromPYIN = (req: Request, res: Response) => {
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
