import { existsSync } from "fs";

export const detectFile = (dst: string) => {
  if (existsSync(decodeURI(dst))) { return; }
  console.error(`file ${decodeURI(dst)} not exist`);
};