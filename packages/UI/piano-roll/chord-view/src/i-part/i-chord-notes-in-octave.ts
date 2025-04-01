import { WindowReflectable } from "@music-analyzer/view";
import { IChordNote } from "./i-chord-note";

export interface IChordNotesInOctave
  extends
  IChordNote,
  WindowReflectable { }
