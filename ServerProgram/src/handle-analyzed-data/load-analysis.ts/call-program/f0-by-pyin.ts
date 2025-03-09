import { execSync } from "child_process";
import { detectFile } from "../../detect-file";
import { existsSync } from "fs";
import { makeNewDir } from "../../make-new-dir";
import { debug_log, DirectoriesWithoutTemp } from "./util";

export const f0By_pYIN = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  img: DirectoriesWithoutTemp,
  song_name: string,
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
  else {
    console.log(`required file ${e.src} not exist`)
  }
  return true;
};
