import { default as fs } from "fs";
import { _throw, } from "../stdlib";

export const getDirectoryContents = (dir_path: string) => new Promise((resolve, reject) => {
  fs.readdir(dir_path, (err, files) => {
    if (err) { return reject(err); }
    else { resolve(files); }
  });
});
