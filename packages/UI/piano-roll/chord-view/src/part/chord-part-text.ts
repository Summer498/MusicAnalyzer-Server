import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { chord_text_size } from "@music-analyzer/chord-view";
import { ChordPart } from "./chord-part";
import { RequiredViewByChordPart } from "./rv-chord-part";
import { ChordPartModel } from "../model";

export abstract class ChordPartText<
  M extends ChordPartModel,
  V extends RequiredViewByChordPart,
> extends ChordPart<M, V> {
  getBottom() { return PianoRollHeight.get() + chord_text_size }
}