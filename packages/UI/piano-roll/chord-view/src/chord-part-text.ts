import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { chord_text_size } from "./chord-view-params/text-size";
import { ChordPart, ChordPartModel } from "./chord-parts-series";
import { A_MVVM_View } from "@music-analyzer/view";

abstract class ChordPartView
  extends A_MVVM_View {
  abstract svg: SVGElement;
  constructor() {
    super();
  }
}

interface RequiredViewByChordPart
  extends ChordPartView {
  updateX: (x: number) => void
  updateY: (y: number) => void
}

export abstract class ChordPartText<
  M extends ChordPartModel,
  V extends RequiredViewByChordPart,
> extends ChordPart<M, V> {
  getBottom() { return PianoRollHeight.get() + chord_text_size }
}
