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

interface IChordNameModel {
  readonly time: Time;
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
  readonly tonic: string;
  readonly name: string;
}

const getChordNameModel = (e: IRequiredByChordPartModel) => ({
  ...e,
  tonic: e.chord.tonic || "",
} as IChordNameModel)

const getColor = (tonic: string) => (s: number, v: number) => { return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)" }
const updateChordNameViewX = (svg: SVGTextElement) => (x: number) => { svg.setAttribute("x", String(x)); }
const updateChordNameViewY = (svg: SVGTextElement) => (y: number) => { svg.setAttribute("y", String(y)); }
const scaled = (e: number) => e * NoteSize.get();

export function buildChordNameSeries(
  romans: IRequiredByChordPartModel[],
  controllers: {
    readonly audio: AudioReflectableRegistry
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
  },
) {
  const children = romans.map(e => {
    const model = getChordNameModel(e);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "text")
    svg.textContent = shortenChord(model.chord.name);
    svg.id = "chord-name";
    svg.style.fontFamily = "Times New Roman";
    svg.style.fontSize = `${chord_text_em}em`;
    svg.style.fill = getColor(model.tonic)(1, 0.75);

    updateChordNameViewX(svg)(scaled(model.time.begin))
    updateChordNameViewY(svg)(PianoRollHeight.get() + chord_text_size)
    return svg
  })
  const id = "chord-names";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  children.forEach(e => svg.appendChild(e));

  controllers.audio.addListeners(() => children.forEach(e => updateChordNameViewY(e)(PianoRollHeight.get() + chord_text_size)));
  controllers.window.addListeners(() => children.forEach(e => updateChordNameViewY(e)(PianoRollHeight.get() + chord_text_size)));
  controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));

  return svg
}