import { _throw } from "../../stdlib";
import { detectFile } from "../detect-file";
import { runProcessWithCache } from "../run-process-with-cache";
import { DataDirectories, Directories } from "../data-directories";
import { rename } from "./util";

export const chordExtract = (force: boolean, directories: Directories) => {
  const e = directories;
  detectFile(e.src);
  runProcessWithCache(force, e.dst, `python -m chordExtract "${e.src}" "${e.dst}"`);
};

export const chordToRoman = (force: boolean, directories: Directories) => {
  const e = directories;
  detectFile(e.src);
  runProcessWithCache(true, e.dst, `node ./packages/chord-analyze-cli < "${e.src}" > "${e.dst}"`);
};

export const crepe = (force: boolean, directories: Directories, tmp: string) => {
  const e = directories;
  detectFile(e.src);
  runProcessWithCache(force, e.dst, `"python -m crepe "${e.src}" >&2"`);
  rename(e.dst, tmp);
};

export const postCrepe = (force: boolean, directories: Directories) => {
  const e = directories;
  detectFile("$post_crepe.src");
  runProcessWithCache(force, e.dst, `python -m post-crepe "${e.src}" -o "${e.dst}"`);
};

export const analyzeMelodyFromCrepeF0 = (force: boolean, directories: Directories, chord_src: string) => {
  const e = directories;
  detectFile(e.src);
  detectFile(chord_src);
  runProcessWithCache(force, e.dst, `node ./packages/melody-analyze-cli -m "${e.src}" -r "${chord_src}" -o "${e.dst}" --sampling_rate 100`);
};

export const loadAnalysisFromCREPE = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);
  crepe(force_reanalyze, e.crepe, e.crepe_tmp);
  postCrepe(force_reanalyze, e.post_crepe);
  analyzeMelodyFromCrepeF0(force_reanalyze, e.melody_analyze_crepe, e.chord_to_roman.dst);
};

export const pyin = (force: boolean, directories: Directories, img_dir: Directories) => {
  const e = directories;
  detectFile(e.src);
  runProcessWithCache(force, e.dst, `python -m pyin "${e.src}" --fmin 128 --fmax 1024 -o "${e.dst}"`);
  runProcessWithCache(force, img_dir.dst, `python -m pyin2img "${img_dir.src}" --audio_file "${e.src}" -o "${img_dir.dst}"`);

};

export const postPYIN = (force: boolean, directories: Directories, post_pyin_dir: string) => {
  const e = directories;
  detectFile(e.src);
  runProcessWithCache(force, e.dst, `node ./packages/post-pyin "${e.src}" "${post_pyin_dir}"`);
};

export const analyzeMelodyFromPYINf0 = (force: boolean, directories: Directories, chord_src: string) => {
  const e = directories;
  detectFile(e.src);
  detectFile(chord_src);
  const sr = 22050 / 1024;
  runProcessWithCache(force, e.dst, `node ./packages/melody-analyze-cli -m "${e.src}" -r "${chord_src}" -o "${e.dst}" --sampling_rate ${sr}`);
};

export const loadAnalysisFromPYIN = (song_name: string, file_path: string) => {
  const force_reanalyze = false;
  const e = new DataDirectories(song_name, file_path);
  pyin(force_reanalyze, e.pyin, e.pyin_img);
  postPYIN(force_reanalyze, e.post_pyin, e.post_pyin_dir);
  analyzeMelodyFromPYINf0(force_reanalyze, e.melody_analyze_pyin, e.chord_to_roman.dst);
};

export const demucs = (force_reanalyze: boolean, directories: Directories, separate_dir: string) => {
  const e = directories;
  detectFile(e.src);
  runProcessWithCache(false, separate_dir, `python -m demucs -d cuda "${e.src}" >&2"`);
  rename(separate_dir, e.dst);
};

