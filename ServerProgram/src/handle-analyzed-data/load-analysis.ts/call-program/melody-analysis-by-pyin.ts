import { execSync } from "child_process";
import { detectFile } from "../../detect-file";
import { existsSync } from "fs";
import { makeNewDir } from "../../make-new-dir";
import { debug_log } from "./util";
import { DirectoriesWithoutTemp } from "./util";

export const melodyAnalysisBy_pYIN = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  chord_src: string,
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
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};
