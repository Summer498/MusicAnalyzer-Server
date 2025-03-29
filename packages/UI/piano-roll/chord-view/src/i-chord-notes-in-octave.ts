import { WindowReflectable } from "@music-analyzer/view/src/reflectable/window-reflectable";
import { IChordNote } from "./i-chord-note";

export interface IChordNotesInOctave
  extends
  IChordNote,
  WindowReflectable { }
