import { AudioReflectableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { ReflectableTimeAndMVCControllerCollection } from "@music-analyzer/view";
import { NoteSize } from "@music-analyzer/view-parameters";
import { Time } from "@music-analyzer/time-and";
import { Chord } from "@music-analyzer/tonal-objects";
import { Scale } from "@music-analyzer/tonal-objects";
import { fifthToColor } from "@music-analyzer/color";
import { oneLetterKey } from "./shorten/on-letter-key";
import { chord_text_em } from "./chord-view-params/text-em";
import { RequiredByChordPartModel } from "./require-by-chord-part-model";
import { TimeRangeController } from "@music-analyzer/controllers";

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

export const getColor = (tonic: string) => (s: number, v: number) => { return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)" }
export class ChordPartView_impl<Tag extends keyof SVGElementTagNameMap> {
  readonly svg: SVGElementTagNameMap[Tag];
  constructor(
    tag: Tag,
    readonly model: ChordPartModel
  ) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", tag);
    svg.id = "key-name";
    svg.style.fontFamily = "Times New Roman";
    svg.style.fontSize = `${chord_text_em}em`;
    svg.style.textAnchor = "end";
    this.svg = svg;
    this.svg.textContent = oneLetterKey(model.scale) + ': ';
    this.svg.style.fill = getColor(model.tonic)(1, 0.75);
  }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
}

export abstract class ChordPart<
  M extends ChordPartModel,
  V extends {
    svg: SVGElement;
    updateX: (x: number) => void
    updateY: (y: number) => void
  },
> {
  protected abstract y: number;
  constructor(
    readonly model: M,
    readonly view: V,
  ) {
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
  <T extends {
    readonly svg: SVGElement
    readonly model: { readonly time: Time };
    onWindowResized: () => void
    onTimeRangeChanged: () => void
  }>
  extends ReflectableTimeAndMVCControllerCollection<T> {
  constructor(
    id: string,
    controllers: {
      readonly audio: AudioReflectableRegistry
      readonly window: WindowReflectableRegistry,
      readonly time_range: TimeRangeController,
    },
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
