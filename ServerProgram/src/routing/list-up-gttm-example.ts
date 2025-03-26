import { Request } from "express";
import { Response } from "express";
import { getDirectoryContents } from "./get-directory-contents";

export const listUpGTTMExample = (req: Request, res: Response) => {
  if (req.url !== "/MusicAnalyzer-server/api/gttm-example/") {
    throw new EvalError(`function handleHierarchicalAnalysisSample requires the url ends with '/'`);
  }

  // json にリストを載せて返す
  const read_dir = `resources/gttm-example/`;
  try {
    getDirectoryContents(read_dir)
      .then(files => res.json(files));
  } catch (err) {
    res.status(500).json({ error: `Failed to read directory contents of ${read_dir}` });
  }
};
