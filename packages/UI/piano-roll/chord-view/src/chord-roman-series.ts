import { AudioReflectableRegistry, PianoRollTranslateX } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { Chord, Scale } from "@music-analyzer/tonal-objects";
import { Time } from "@music-analyzer/time-and";
import { fifthToColor } from "@music-analyzer/color";

import { chord_name_margin } from "./chord-view-params/margin";
import { chord_text_size } from "./chord-view-params/text-size";
import { shortenChord } from "./shorten/chord";
import { chord_text_em } from "./chord-view-params/text-em";

interface IRequiredByChordPartModel {
  readonly time: Time
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
}

interface RequiredByChordRomanSeries {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

interface IChordRomanModel {
  readonly time: Time
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
  readonly tonic: string;
}

const getChordRomanModel = (e: IRequiredByChordPartModel) => ({
  time: e.time,
  chord: e.chord,
  scale: e.scale,
  roman: e.roman,
  tonic: e.chord.tonic || "",
} as IChordRomanModel)

const getColor = (tonic: string) => (s: number, v: number) => { return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)" }
class ChordRomanView {
  constructor(
    readonly svg: SVGTextElement
  ) { }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
}

class ChordRoman {
  readonly model: IChordRomanModel;
  readonly view: ChordRomanView;
  get svg() { return this.view.svg; }
  y: number;
  constructor(
    model: IChordRomanModel,
    view: ChordRomanView,
  ) {
    this.model = model;
    this.view = view;
    this.y = PianoRollHeight.get() + chord_text_size + (chord_text_size + chord_name_margin);
    this.updateX();
    this.updateY();
  }
  onWindowResized() { this.updateX(); }
  private scaled = (e: number) => e * NoteSize.get();
  updateX() { this.view.updateX(this.scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(this.y) }
  onTimeRangeChanged = this.onWindowResized
}

class ChordRomanSeries {
  readonly svg: SVGGElement
  readonly children_model: { readonly time: Time }[];
  #show: ChordRoman[];
  get show() { return this.#show; };

  constructor(
    romans: IRequiredByChordPartModel[],
    controllers: RequiredByChordRomanSeries,
  ) {
    const children = romans.map(e => {
      const model = getChordRomanModel(e);

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
      svg.textContent = shortenChord(model.roman);
      svg.id = "roman-name";
      svg.style.fontFamily = "Times New Roman";
      svg.style.fontSize = `${chord_text_em}em`;
      svg.style.fill = getColor(model.tonic)(1, 0.75);

      const view = new ChordRomanView(svg);

      return new ChordRoman(model, view)
    });
    const id = "roman-names"
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach(e => svg.appendChild(e.svg));
    
    controllers.audio.addListeners(()=>children.forEach(e => e.onTimeRangeChanged()));
    controllers.window.addListeners(()=>children.forEach(e => e.onWindowResized()));
    controllers.time_range.addListeners(()=>svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));
    
    this.svg = svg;
    this.children_model = children.map(e => e.model);
    this.#show = children;
  }
}

export function buildChordRomanSeries(
  romans: IRequiredByChordPartModel[],
  controllers: RequiredByChordRomanSeries,
) {
  return new ChordRomanSeries(romans, controllers);
}