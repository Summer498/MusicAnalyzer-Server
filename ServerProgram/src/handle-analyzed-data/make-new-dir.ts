import { chmodSync, mkdirSync } from "fs";
import { dirname } from "path";

export const makeNewDir = (
  dst_dir: string
) => {
  if (decodeURI(dirname(dst_dir))) { return; }
  mkdirSync(decodeURI(dst_dir));
  chmodSync(decodeURI(dst_dir), 0o775);
};
