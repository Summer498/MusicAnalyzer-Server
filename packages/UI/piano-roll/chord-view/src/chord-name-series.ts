import { AudioReflectableRegistry, PianoRollTranslateX } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { Chord, Scale } from "@music-analyzer/tonal-objects";
import { Time } from "@music-analyzer/time-and";
import { fifthToColor } from "@music-analyzer/color";

import { chord_text_em } from "./chord-view-params/text-em";
import { shortenChord } from "./shorten/chord";
import { chord_text_size } from "./chord-view-params/text-size";

interface IRequiredByChordPartModel {
  readonly time: Time
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
}

interface RequiredByChordNameSeries {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

interface IChordNameModel {
  readonly time: Time;
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
  readonly tonic: string;
  readonly name: string;
}

const getChordNameModel = (e: IRequiredByChordPartModel) => ({
  time: e.time,
  chord: e.chord,
  scale: e.scale,
  roman: e.roman,
  tonic: e.chord.tonic || "",
  name: e.chord.name,
} as IChordNameModel)

const getColor = (tonic: string) => (s: number, v: number) => { return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)" }
const updateChordNameViewX = (svg: SVGTextElement) => (x: number) => { svg.setAttribute("x", String(x)); }
const updateChordNameViewY = (svg: SVGTextElement) => (y: number) => { svg.setAttribute("y", String(y)); }

class ChordName {
  y: number;
  constructor(
    readonly model: IChordNameModel,
    readonly svg: SVGTextElement,
  ) {
    this.y = PianoRollHeight.get() + chord_text_size
    this.updateX();
    this.updateY();
  }
  onWindowResized() { this.updateX(); }
  private scaled = (e: number) => e * NoteSize.get();
  updateX() { updateChordNameViewX(this.svg)(this.scaled(this.model.time.begin)) }
  updateY() { updateChordNameViewY(this.svg)(this.y) }
  onTimeRangeChanged = this.onWindowResized
}

class ChordNameSeries {
  readonly svg: SVGGElement
  readonly children_model: { readonly time: Time }[];
  #show: ChordName[];
  get show() { return this.#show; };

  constructor(
    romans: IRequiredByChordPartModel[],
    controllers: RequiredByChordNameSeries,
  ) {
    const children = romans.map(e => {
      const model = getChordNameModel(e);

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "text")
      svg.textContent = shortenChord(model.chord.name);
      svg.id = "chord-name";
      svg.style.fontFamily = "Times New Roman";
      svg.style.fontSize = `${chord_text_em}em`;
      svg.style.fill = getColor(model.tonic)(1, 0.75);

      return new ChordName(model, svg)
    })
    const id = "chord-names";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach(e => svg.appendChild(e.svg));

    controllers.audio.addListeners(() => children.forEach(e => e.onTimeRangeChanged()));
    controllers.window.addListeners(() => children.forEach(e => e.onWindowResized()));
    controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));

    this.svg = svg;
    this.children_model = children.map(e => e.model);
    this.#show = children;
  }
}

export function buildChordNameSeries(
  romans: IRequiredByChordPartModel[],
  controllers: RequiredByChordNameSeries,
) {
  return new ChordNameSeries(romans, controllers)
}