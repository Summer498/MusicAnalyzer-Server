import { WindowReflectable } from "./facade";
import { IChordNote } from "./i-chord-note";

export interface IChordNotesInOctave
  extends
  IChordNote,
  WindowReflectable { }
