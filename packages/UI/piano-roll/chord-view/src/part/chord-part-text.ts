import { PianoRollHeight } from "@music-analyzer/view-parameters/src/piano-roll/piano-roll-height";
import { chord_text_size } from "../chord-view-params/text-size";
import { ChordPart } from "./chord-part";
import { ChordPartModel } from "./model";
import { RequiredViewByChordPart } from "./rv-chord-part";

export abstract class ChordPartText<
  M extends ChordPartModel,
  V extends RequiredViewByChordPart,
> extends ChordPart<M, V> {
  getBottom() { return PianoRollHeight.get() + chord_text_size }
}