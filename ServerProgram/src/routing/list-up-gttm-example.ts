import { Request, Response } from "express";
import { _throw, } from "../stdlib";
import { getDirectoryContents } from "./get-directory-contents";
import { HOME_DIR } from "../constants";

export const listUpGTTMExample = (req: Request, res: Response) => {
  req.url || _throw(TypeError(`requested URL is null`));
  req.url === "/MusicAnalyzer-server/api/gttm-example/"
    || _throw(EvalError(`function handleHierarchicalAnalysisSample requires the url ends with '/'`));

  // json にリストを載せて返す
  const read_dir = `${HOME_DIR}/resources/gttm-example/`;
  try {
    getDirectoryContents(read_dir).then(
      files => res.json(files)
    );
  } catch (err) {
    res.status(500).json({ error: `Failed to read directory contents of ${read_dir}` });
  }
};
