import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { ChordPart } from "./chord-part";
import { RequiredViewByChordPart } from "./rv-chord-part";
import { ChordPartModel } from "../model";
import { chord_text_size } from "../chord-view-params";

export abstract class ChordPartText<
  M extends ChordPartModel,
  V extends RequiredViewByChordPart,
> extends ChordPart<M, V> {
  getBottom() { return PianoRollHeight.get() + chord_text_size }
}