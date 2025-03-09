import { Directories } from "../../data-directories";

export const python = `MUSIC_ANALYZER/bin/python`;
export const activate = '. /MUSIC_ANALYZER/bin/activate';

export type DirectoriesWithTemp = Directories<string, string, string, string>;
export type DirectoriesWithoutTemp = Directories<string, undefined, string, string>;

export const debug_log = (message: string) => {
  if (false) { console.log(message) }
}
