import { PianoRollHeight } from "./facade";
import { chord_text_size } from "./facade";
import { ChordPart } from "./chord-part";
import { ChordPartModel } from "./facade";
import { RequiredViewByChordPart } from "./rv-chord-part";

export abstract class ChordPartText<
  M extends ChordPartModel,
  V extends RequiredViewByChordPart,
> extends ChordPart<M, V> {
  getBottom() { return PianoRollHeight.get() + chord_text_size }
}