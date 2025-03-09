import { execSync } from "child_process";
import { detectFile } from "../../detect-file";
import { existsSync, renameSync, rmdirSync } from "fs";
import { makeNewDir } from "../../make-new-dir";
import { debug_log, DirectoriesWithTemp } from "./util";

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
