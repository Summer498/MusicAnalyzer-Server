import { AudioReflectable } from "./facade";
import { IChordPart } from "./i-chord-parts";

export interface IChordNote
  extends
  IChordPart,
  AudioReflectable { }
