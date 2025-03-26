import { execSync } from "child_process";
import { detectFile } from "../../detect-file";
import { existsSync } from "fs";
import { makeNewDir } from "../../make-new-dir";
import { debug_log } from "./util";
import { DirectoriesWithoutTemp } from "./util";

export const chordExtract = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
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
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};
