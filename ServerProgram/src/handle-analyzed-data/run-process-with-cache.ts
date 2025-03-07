import { execFileSync } from "child_process";
import * as shellQuote from "shell-quote";
import { dirname } from "path";
import { _throw } from "../stdlib";
import { makeNewDir } from "./make-new-dir";
import { chmodSync, existsSync } from "fs";

const _runProcessWithCache = (
  dst: string,
  process: string
) => {
  try {
    makeNewDir(dirname(dst));
    console.log(decodeURI(process));
    const processArgs = shellQuote.parse(decodeURI(process));
    execFileSync(processArgs[0], processArgs.slice(1));
    chmodSync(decodeURI(dst), 0o775);
  } catch (e) {
    console.trace(e);
    return false;
  }
  return true;
};

export const runProcessWithCache = (
  force: boolean,
  dst: string,
  process: string
) => {
  if (force === false && existsSync(decodeURI(dst))) {
    console.log(`${decodeURI(dst)} already exist`);
    return false;
  }
  else { return _runProcessWithCache(dst, process); }
};
