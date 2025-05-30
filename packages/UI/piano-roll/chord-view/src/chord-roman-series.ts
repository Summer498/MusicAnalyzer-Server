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

interface IChordRomanModel {
  readonly time: Time
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
  readonly tonic: string;
}

const getChordRomanModel = (e: IRequiredByChordPartModel) => ({
  ...e,
  tonic: e.chord.tonic || "",
} as IChordRomanModel)

const getColor = (tonic: string) => (s: number, v: number) => { return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)" }
const updateChordRomanViewX = (svg: SVGTextElement) => (x: number) => { svg.setAttribute("x", String(x)); }
const updateChordRomanViewY = (svg: SVGTextElement) => (y: number) => { svg.setAttribute("y", String(y)); }
const scaled = (e: number) => e * NoteSize.get();

export function buildChordRomanSeries(
  romans: IRequiredByChordPartModel[],
  controllers: {
    readonly audio: AudioReflectableRegistry
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
  },
) {
  const children = romans.map(e => {
    const model = getChordRomanModel(e);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svg.textContent = shortenChord(model.roman);
    svg.id = "roman-name";
    svg.style.fontFamily = "Times New Roman";
    svg.style.fontSize = `${chord_text_em}em`;
    svg.style.fill = getColor(model.tonic)(1, 0.75);

    updateChordRomanViewX(svg)(scaled(model.time.begin))
    updateChordRomanViewY(svg)(PianoRollHeight.get() + chord_text_size + (chord_text_size + chord_name_margin))
    return { model, svg }
  });
  const id = "roman-names"
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  children.forEach(e => svg.appendChild(e.svg));

  controllers.audio.addListeners(() => children.forEach(e => updateChordRomanViewX(e.svg)(scaled(e.model.time.begin))));
  controllers.window.addListeners(() => children.forEach(e => updateChordRomanViewX(e.svg)(scaled(e.model.time.begin))));
  controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));

  return svg;
}