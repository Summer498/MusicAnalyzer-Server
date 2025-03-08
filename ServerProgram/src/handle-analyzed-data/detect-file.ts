import { existsSync } from "fs";

export const detectFile = (dst: string) => {
  const exists = existsSync(decodeURI(dst));
  if (!exists) { console.error(`file "${decodeURI(dst)}" not exist`); }
  return exists;
};