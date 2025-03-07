import { default as fs } from "fs";

export const rename = (src: string, dst: string) => {
  if (fs.existsSync(dst)) { fs.rmdirSync(dst); }
  fs.renameSync(src, dst);
};

