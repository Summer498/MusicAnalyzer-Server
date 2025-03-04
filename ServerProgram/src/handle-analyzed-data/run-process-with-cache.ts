import { default as fs } from "fs";
import { execSync } from "child_process";
import { dirname } from "path";
import { _throw } from "../stdlib";
import { makeNewDir } from "./make-new-dir";

const _runProcessWithCache = (
  dst: string,
  process: string
) => {
  makeNewDir(dirname(dst));
  console.log(process);
  execSync(process);
  fs.chmodSync(dst, 0o775);
};

export const runProcessWithCache = (
  force: boolean,
  dst: string,
  process: string
) => {
  if (force === false && fs.existsSync(dst)) {
    console.log(`${dst} already exist`);
  }
  else { _runProcessWithCache(dst, process); }
};
