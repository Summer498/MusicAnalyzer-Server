import { default as URL } from "url";
import { existsSync } from "fs";
import { basename } from "path";
import { sendFile } from "../../routing";
import { Request } from "express";
import { Response } from "express";
import { ROOT } from "../../constants";
import { DataDirectories } from "../data-directories";
import { chordExtract } from "./call-program";
import { chordToRoman } from "./call-program";


const _loadRomanAnalysis = (update: boolean, song_name: string, file_path: string) => {
  const force = false;
  const e = new DataDirectories(song_name, file_path);

  chordExtract(false, e.chord);
  chordToRoman(update, e.roman);
};

export const loadRomanAnalysis = (req: Request, res: Response) => {
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
