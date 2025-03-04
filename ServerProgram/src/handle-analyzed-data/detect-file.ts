import { default as fs } from "fs";

export const detectFile = (dst: string) => {
  if (fs.existsSync(dst)) { return; }
  console.error(`file ${dst} not exist`);
};