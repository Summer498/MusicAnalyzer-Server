import { PianoRollHeight } from "./facade/view-parameters";
import { chord_text_size } from "./facade/chord-view-params";
import { ChordPart } from "./chord-part";
import { ChordPartModel } from "./facade/model";
import { RequiredViewByChordPart } from "./rv-chord-part";

export abstract class ChordPartText<
  M extends ChordPartModel,
  V extends RequiredViewByChordPart,
> extends ChordPart<M, V> {
  getBottom() { return PianoRollHeight.get() + chord_text_size }
}