import { ChordPartSeries } from "./chord-parts-series";
import { chord_name_margin } from "./chord-view-params/margin";
import { chord_text_size } from "./chord-view-params/text-size";
import { shortenChord } from "./shorten/chord";
import { chord_text_em } from "./chord-view-params/text-em";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { RequiredByChordPartModel } from "./require-by-chord-part-model";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { Chord, Scale } from "@music-analyzer/tonal-objects";
import { Time } from "@music-analyzer/time-and";
import { fifthToColor } from "@music-analyzer/color";

interface RequiredByChordRomanSeries {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

class ChordRomanModel {
  readonly time: Time
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
  readonly tonic: string;
  constructor(e: RequiredByChordPartModel) {
    this.time = e.time;
    this.chord = e.chord;
    this.scale = e.scale;
    this.roman = e.roman
    this.tonic = e.chord.tonic || "";
  }
}

const getColor = (tonic: string) => (s: number, v: number) => { return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)" }
class ChordRomanView {
  constructor(
    readonly svg: SVGTextElement
  ) { }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
}

class ChordRoman {
  readonly model: ChordRomanModel;
  readonly view: ChordRomanView;
  get svg() { return this.view.svg; }
  y: number;
  constructor(
    model: ChordRomanModel,
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

export class ChordRomanSeries
  extends ChordPartSeries<ChordRoman> {
  constructor(
    romans: RequiredByChordPartModel[],
    controllers: RequiredByChordRomanSeries,
  ) {
    const children = romans.map(e => {
      const model = new ChordRomanModel(e);

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
      svg.textContent = shortenChord(model.roman);
      svg.id = "roman-name";
      svg.style.fontFamily = "Times New Roman";
      svg.style.fontSize = `${chord_text_em}em`;
      svg.style.fill = getColor(model.tonic)(1, 0.75);

      const view = new ChordRomanView(svg);

      return new ChordRoman(model, view)
    });
    super("roman-names", controllers, children);
  }
}
