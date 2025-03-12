import { execSync } from "child_process";
import { detectFile } from "../../detect-file";
import { existsSync } from "fs";
import { makeNewDir } from "../../make-new-dir";
import { debug_log, DirectoriesWithoutTemp } from "./util";

export const semitonesBy_pYIN = (
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
    execSync(`node ./packages/cli/post-pyin "${e.src}" "${e.dst_dir}"`)
  }
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};
