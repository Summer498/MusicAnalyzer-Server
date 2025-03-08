import { execSync } from "child_process";
import { Directories } from "../data-directories";
import { detectFile } from "../detect-file";
import { existsSync, renameSync, rmdirSync } from "fs";
import { makeNewDir } from "../make-new-dir";

const python = `MUSIC_ANALYZER/bin/python`;
const activate = '. /MUSIC_ANALYZER/bin/activate';

type DirectoriesWithTemp = Directories<string, string, string, string>;
type DirectoriesWithoutTemp = Directories<string, undefined, string, string>;

const debug_log = (message: string) => {
  if (false) { console.log(message) }
}

export const demucs = (
  force: boolean,
  directories: DirectoriesWithTemp,
  song_name: string,
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execSync(`./sh/callDemucs.sh "${decodeURI(e.src)}" "${decodeURI(e.dst)}"`);
    if (existsSync(e.tmp)) {
      if (existsSync(e.dst)) { rmdirSync(e.dst_dir) }
      renameSync(e.tmp, e.dst_dir);
    }
  }
  return true;
};

export const chordExtract = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  song_name: string
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execSync(`./sh/callChordExtract.sh "${decodeURI(e.src)}" "${decodeURI(e.dst)}"`);
  }
  return true;
};

export const chordToRoman = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  song_name: string
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execSync(`node ./packages/chord-analyze-cli < "${e.src}" > "${e.dst}"`)
  }
  return true;
};

export const f0ByCrepe = (
  force: boolean,
  directories: DirectoriesWithTemp,
  song_name: string
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execSync(`./sh/callCrepe.sh "${song_name}"`);
  }
  return true;
};

export const midiByCrepe = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  song_name: string
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execSync(`./sh/callPostCrepe.sh "${song_name}"`);
  }
  return true;
};

export const melodyByCrepe = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  chord_src: string,
  song_name: string
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src) && detectFile(chord_src)) {
    makeNewDir(e.dst_dir);
    execSync(`node ./packages/melody-analyze-cli -m "${e.src}" -r "${chord_src}" -o "${e.dst}" --sampling_rate 100`)
  }
  return true;
};

export const f0By_pYIN = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  img: DirectoriesWithoutTemp,
  song_name: string
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execSync(`./sh/callPYIN.sh "${song_name}"`);
    makeNewDir(img.dst_dir);
    execSync(`./sh/callPYIN2img.sh "${song_name}"`);
  }
  return true;
};

export const midiBy_pYIN = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  song_name: string
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src)) {
    makeNewDir(e.dst_dir);
    execSync(`node ./packages/post-pyin "${e.src}" "${e.dst_dir}"`)
  }
  return true;
};

export const melodyBy_pYIN = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  chord_src: string,
  song_name: string
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else if (detectFile(e.src) && detectFile(chord_src)) {
    const sr = 22050 / 1024;
    makeNewDir(e.dst_dir);
    execSync(`node ./packages/melody-analyze-cli -m "${e.src}" -r "${chord_src}" -o "${e.dst}" --sampling_rate ${sr}`)
  }
  return true;
};
