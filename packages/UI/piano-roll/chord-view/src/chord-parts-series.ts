import { AudioReflectableRegistry, I_TimeAndVM, WindowReflectableRegistry } from "@music-analyzer/view";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { NoteSize } from "@music-analyzer/view-parameters";
import { MVVM_ViewModel_Impl } from "@music-analyzer/view";
import { A_MVVM_View } from "@music-analyzer/view";
import { Time } from "@music-analyzer/time-and";
import { Chord } from "@music-analyzer/tonal-objects";
import { Scale } from "@music-analyzer/tonal-objects";
import { MVVM_View_Impl } from "@music-analyzer/view";
import { fifthToColor } from "@music-analyzer/color";
import { oneLetterKey } from "./shorten/on-letter-key";
import { chord_text_em } from "./chord-view-params/text-em";
import { RequiredByChordPartModel } from "./require-by-chord-part-model";
import { TimeRangeController } from "@music-analyzer/controllers";

interface RequiredByChordPartSeries {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

export abstract class ChordPartModel {
  readonly time: Time;
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
  abstract readonly tonic: string
  constructor(e: RequiredByChordPartModel) {
    this.time = e.time;
    this.chord = e.chord;
    this.scale = e.scale;
    this.roman = e.roman
  }
}
export abstract class ChordPartView
  extends A_MVVM_View {
  abstract svg: SVGElement;
  constructor() {
    super();
  }
}
export class ChordPartView_impl<Tag extends keyof SVGElementTagNameMap>
  extends MVVM_View_Impl<Tag> {
  constructor(
    tag: Tag,
    protected readonly model: ChordPartModel
  ) {
    super(tag);
    this.svg.textContent = oneLetterKey(this.model.scale) + ': ';
    this.svg.id = "key-name";
    this.svg.style.fontFamily = "Times New Roman";
    this.svg.style.fontSize = `${chord_text_em}em`;
    this.svg.style.textAnchor = "end";
    this.svg.style.fill = this.getColor(1, 0.75);
  }
  protected getColor(s: number, v: number) { return fifthToColor(this.model.tonic, s, v) || "rgb(0, 0, 0)" }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
}


export interface RequiredViewByChordPart
  extends ChordPartView {
  updateX: (x: number) => void
  updateY: (y: number) => void
}

export abstract class ChordPart<
  M extends ChordPartModel,
  V extends RequiredViewByChordPart,
> extends MVVM_ViewModel_Impl<M, V> {
  protected abstract y: number;
  constructor(
    model: M,
    view: V,
  ) {
    super(model, view);
    this.updateX();
    this.updateY();
  }
  protected scaled = (e: number) => e * NoteSize.get();

  updateX() { this.view.updateX(this.scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(this.y) }
  abstract onWindowResized(): void;
  onTimeRangeChanged = this.onWindowResized
}

export abstract class ChordPartSeries
  <T extends I_TimeAndVM & { onWindowResized: () => void } & { onTimeRangeChanged: () => void }>
  extends ReflectableTimeAndMVCControllerCollection<T> {
  constructor(
    id: string,
    controllers: RequiredByChordPartSeries,
    romans: T[],
  ) {
    super(id, romans);
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this));
    controllers.time_range.addListeners(this.onTimeRangeChanged.bind(this));
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}
