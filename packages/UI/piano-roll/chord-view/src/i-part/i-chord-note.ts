import { AudioReflectable } from "@music-analyzer/view";
import { IChordPart } from "./i-chord-parts";

export interface IChordNote
  extends
  IChordPart,
  AudioReflectable { }
