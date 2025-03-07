import { execSync } from "child_process";
import { dirname } from "path";
import { _throw } from "../stdlib";
import { makeNewDir } from "./make-new-dir";
import { chmodSync, existsSync } from "fs";

const _runProcessWithCache = (
  dst: string,
  process: string
) => {
  makeNewDir(dirname(dst));
  console.log(decodeURI(process));
  execSync(decodeURI(process));
  chmodSync(decodeURI(dst), 0o775);
};

export const runProcessWithCache = (
  force: boolean,
  dst: string,
  process: string
) => {
  if (force === false && existsSync(decodeURI(dst))) {
    console.log(`${decodeURI(dst)} already exist`);
  }
  else { _runProcessWithCache(dst, process); }
};
