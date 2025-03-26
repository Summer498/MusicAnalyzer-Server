import { execSync } from "child_process";
import { detectFile } from "../../detect-file";
import { existsSync } from "fs";
import { makeNewDir } from "../../make-new-dir";
import { debug_log } from "./util";
import { DirectoriesWithoutTemp } from "./util";

export const melodyAnalysisByCrepe = (
  force: boolean,
  directories: DirectoriesWithoutTemp,
  chord_src: string,
) => {
  const e = directories;
  if (force === false && existsSync(decodeURI(e.dst))) {
    debug_log(`${decodeURI(e.dst)} already exist`);
    return false;
  }
  else {
    const has_midi_src = detectFile(e.src);
    const has_chord_src = detectFile(chord_src);
    if (has_midi_src && has_chord_src) {
      makeNewDir(e.dst_dir);
      execSync(`node ./packages/melody-analyze-cli -m "${e.src}" -r "${chord_src}" -o "${e.dst}" --sampling_rate 100`)
    }
    else if (false === has_chord_src) {
      console.log(`required file ${chord_src} not exist`)
    }
    else {
      console.log(`required file ${e.src} not exist`)
    }
  }
  return true;
};
