import { execSync } from "child_process";
import { Directories } from "../data-directories";
import { detectFile } from "../detect-file";
import { runProcessWithCache } from "../run-process-with-cache";
import { rename } from "./util";

const python = `MUSIC_ANALYZER/bin/python`;
const activate = '. /MUSIC_ANALYZER/bin/activate';

export const demucs = (force: boolean, directories: Directories, separate_dir: string) => {
  const e = directories;
  if (detectFile(e.src)) {
    execSync(`./sh/callDemucs.sh ${e.src} ${e.dst}`);
    /*
      if (runProcessWithCache(false, separate_dir, `${activate} && ${python} -m demucs -d cuda "${e.src}" >&2"`)) {
        rename(separate_dir, e.dst);
      }
    */
  }
};

export const chordExtract = (force: boolean, directories: Directories) => {
  const e = directories;
  if (detectFile(e.src)) {
    execSync(`./sh/callChordExtract.sh ${e.src} ${e.dst}`);
    /*
      runProcessWithCache(force, e.dst, `${activate} && ${python} -m chordExtract "${e.src}" "${e.dst}"`);
    */
  }
};

export const chordToRoman = (force: boolean, directories: Directories) => {
  const e = directories;
  if (detectFile(e.src)) {
    runProcessWithCache(true, e.dst, `node ./packages/chord-analyze-cli < "${e.src}" > "${e.dst}"`);
  }
};

export const crepe = (force: boolean, directories: Directories, tmp: string) => {
  const e = directories;
  if (detectFile(e.src)) {
    execSync(`./sh/callCrepe.sh ${e.src} ${e.dst}`);
    /*
      if (runProcessWithCache(force, e.dst, `"${activate} && ${python} -m crepe "${e.src}" >&2"`)) {
        rename(e.dst, tmp);
      }
    */
  }
};

export const postCrepe = (force: boolean, directories: Directories) => {
  const e = directories;
  if (detectFile(e.src)) {
    execSync(`./sh/callPostCrepe.sh ${e.src} ${e.dst}`);
    /*
      runProcessWithCache(force, e.dst, `${activate} && ${python} -m post-crepe "${e.src}" -o "${e.dst}"`);
    */
  }
};

export const analyzeMelodyFromCrepeF0 = (force: boolean, directories: Directories, chord_src: string) => {
  const e = directories;
  if (detectFile(e.src) && detectFile(chord_src)) {
    runProcessWithCache(force, e.dst, `node ./packages/melody-analyze-cli -m "${e.src}" -r "${chord_src}" -o "${e.dst}" --sampling_rate 100`);
  }
};

export const pyin = (force: boolean, directories: Directories, img_dir: Directories) => {
  const e = directories;
  if (detectFile(e.src)) {
    execSync(`./sh/callPYIN.sh ${e.src} ${e.dst}`);
    execSync(`./sh/callPYIN2img.sh ${img_dir.src} ${img_dir.dst}`);
    /*
      if (runProcessWithCache(force, e.dst, `${activate} && ${python} -m pyin "${e.src}" --fmin 128 --fmax 1024 -o "${e.dst}"`)) {
        runProcessWithCache(force, img_dir.dst, `${activate} && ${python} -m pyin2img "${img_dir.src}" --audio_file "${e.src}" -o "${img_dir.dst}"`);
      }
    */
  }
};

export const postPYIN = (force: boolean, directories: Directories, post_pyin_dir: string) => {
  const e = directories;
  if (detectFile(e.src)) {
    runProcessWithCache(force, e.dst, `node ./packages/post-pyin "${e.src}" "${post_pyin_dir}"`);
  }
};

export const analyzeMelodyFromPYINf0 = (force: boolean, directories: Directories, chord_src: string) => {
  const e = directories;
  if (detectFile(e.src) && detectFile(chord_src)) {
    const sr = 22050 / 1024;
    runProcessWithCache(force, e.dst, `node ./packages/melody-analyze-cli -m "${e.src}" -r "${chord_src}" -o "${e.dst}" --sampling_rate ${sr}`);
  }
};
