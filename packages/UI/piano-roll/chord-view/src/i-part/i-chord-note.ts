import { AudioReflectable } from "./facade/view";
import { IChordPart } from "./i-chord-parts";

export interface IChordNote
  extends
  IChordPart,
  AudioReflectable { }
