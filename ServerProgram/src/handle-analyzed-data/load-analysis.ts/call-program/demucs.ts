import { execSync } from "child_process";
import { detectFile } from "../../detect-file";
import { existsSync } from "fs";
import { rmdirSync } from "fs";
import { renameSync } from "fs";
import { debug_log } from "./util";
import { DirectoriesWithTemp } from "./util";
import { makeNewDir } from "../../make-new-dir";

export const demucs = (
  force: boolean,
  directories: DirectoriesWithTemp,
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
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};
