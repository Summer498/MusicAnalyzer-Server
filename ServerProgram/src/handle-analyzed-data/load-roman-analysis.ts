import { default as fs } from "fs";
import { default as url } from "url";
import { basename } from "path";
import { _throw, assertNonNullable as NN } from "../stdlib";
import { sendFile } from "../routing";
import { Request, Response } from "express";
import { HOME_DIR, HOME } from "../constants";
import { detectFile } from "./detect-file";
import { runProcessWithCache } from "./run-process-with-cache";

const _loadRomanAnalysis = (song_name: string) => {
  const force_reanalyze = false;
  const filepath = "";
  const chord_ext_src = filepath;
  const chord_ext_dst = `./resources/${song_name}/analyzed/chord/chords.json`;
  detectFile(chord_ext_src);
  runProcessWithCache(false, chord_ext_dst, `python -m chordExtract \"${chord_ext_src}\" \"${chord_ext_dst}\"`);

  const chord_to_roman_src = chord_ext_dst;
  const chord_to_roman_dst = `./resources/${song_name}/analyzed/chord/roman.json`;
  detectFile(chord_to_roman_src);
  runProcessWithCache(true, chord_to_roman_dst, `node ./packages/chord-analyze-cli < \"${chord_to_roman_src}\" > \"${chord_to_roman_dst}\"`);

  // execSync(`./ranalyze.sh -q ${HOME_DIR}/${song_dir}/${song_name}.${ext}`);
};

export const loadRomanAnalysis = (req: Request, res: Response) => {
  console.log("*/analyzed/chord/roman.json");
  const decoded_url = decodeURI(req.url);
  const req_path = decodeURI(NN(url.parse(decoded_url, true, true).pathname).replace(`/${HOME}/`, ""));
  const song_dir = req_path.replace("/analyzed/chord/roman.json", "");
  const song_name = basename(song_dir);
  // if (fs.existsSync(`${HOME_DIR}/${req_path}`)) { sendFile(req, res, `${HOME_DIR}/${req_path}`); return }


  const extensions: ["wav", "mp3", "mp4", "m4a"] = ["wav", "mp3", "mp4", "m4a"];
  const ext = extensions.find(e => fs.existsSync(`${HOME_DIR}/${song_dir}/${song_name}.${e}`));
  if (ext) { _loadRomanAnalysis(song_name); }
  sendFile(req, res, `${HOME_DIR}/${req_path}`);
};
