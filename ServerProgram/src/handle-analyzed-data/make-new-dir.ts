import { default as fs } from "fs";
import { dirname } from "path";

export const makeNewDir = (
  dst_dir: string
) => {
  if (dirname(dst_dir)) { return; }
  fs.mkdirSync(dst_dir);
  fs.chmodSync(dst_dir, 0o775);
};
