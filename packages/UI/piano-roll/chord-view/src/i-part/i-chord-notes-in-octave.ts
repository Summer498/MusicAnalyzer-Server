import { WindowReflectable } from "./facade/view";
import { IChordNote } from "./i-chord-note";

export interface IChordNotesInOctave
  extends
  IChordNote,
  WindowReflectable { }
