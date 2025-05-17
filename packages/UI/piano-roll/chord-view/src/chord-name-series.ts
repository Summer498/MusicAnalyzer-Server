import { ChordPartSeries } from "./chord-parts-series";
import { chord_text_em } from "./chord-view-params/text-em";
import { shortenChord } from "./shorten/chord";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { RequiredByChordPartModel } from "./require-by-chord-part-model";
import { chord_text_size } from "./chord-view-params/text-size";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { Chord, Scale } from "@music-analyzer/tonal-objects";
import { Time } from "@music-analyzer/time-and";
import { fifthToColor } from "@music-analyzer/color";

interface RequiredByChordNameSeries {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}


class ChordNameModel {
  readonly time: Time;
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
  readonly tonic: string;
  readonly name: string;
  constructor(e: RequiredByChordPartModel) {
    this.time = e.time;
    this.chord = e.chord;
    this.scale = e.scale;
    this.roman = e.roman
    this.tonic = this.chord.tonic || "";
    this.name = this.chord.name;
  }
}

const getColor = (tonic: string) => (s: number, v: number) => { return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)" }
class ChordNameView {
  constructor(
    readonly svg: SVGTextElement,
  ) { }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
}

class ChordName {
  get svg() { return this.view.svg }
  y: number;
  constructor(
    readonly model: ChordNameModel,
    readonly view: ChordNameView,
  ) {
    this.y = PianoRollHeight.get() + chord_text_size
    this.updateX();
    this.updateY();
  }
  onWindowResized() {
    this.updateX();
  }
  private scaled = (e: number) => e * NoteSize.get();
  updateX() { this.view.updateX(this.scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(this.y) }
  onTimeRangeChanged = this.onWindowResized
}

export class ChordNameSeries
  extends ChordPartSeries<ChordName> {
  constructor(
    romans: RequiredByChordPartModel[],
    controllers: RequiredByChordNameSeries,
  ) {
    const children = romans.map(e => {
      const model = new ChordNameModel(e);

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "text")
      svg.textContent = shortenChord(model.chord.name);
      svg.id = "chord-name";
      svg.style.fontFamily = "Times New Roman";
      svg.style.fontSize = `${chord_text_em}em`;
      svg.style.fill = getColor(model.tonic)(1, 0.75);

      const view = new ChordNameView(svg);
      return new ChordName(model, view)
    })
    super("chord-names", controllers, children);
  }
}
