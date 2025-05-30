import { AudioReflectableRegistry, PianoRollTranslateX } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { NoteSize, PianoRollHeight } from "@music-analyzer/view-parameters";
import { Chord, Scale } from "@music-analyzer/tonal-objects";
import { Time } from "@music-analyzer/time-and";
import { fifthToColor } from "@music-analyzer/color";

import { chord_name_margin } from "./chord-view-params/margin";
import { chord_text_size } from "./chord-view-params/text-size";
import { chord_text_em } from "./chord-view-params/text-em";
import { oneLetterKey } from "./shorten/on-letter-key";

interface IRequiredByChordPartModel {
  readonly time: Time
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
}

interface IChordKeyModel {
  readonly time: Time
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
  readonly tonic: string;
}

const getChordKeyModel = (e: IRequiredByChordPartModel) => ({
  time: e.time,
  chord: e.chord,
  scale: e.scale,
  roman: e.roman,
  tonic: e.scale.tonic || "",
} as IChordKeyModel)

const getColor = (tonic: string) => (s: number, v: number) => { return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)" }
const updateChordKeyViewX = (svg: SVGTextElement) => (x: number) => { svg.setAttribute("x", String(x)); }
const updateChordKeyViewY = (svg: SVGTextElement) => (y: number) => { svg.setAttribute("y", String(y)); }
const scaled = (e: number) => e * NoteSize.get();
const onWindowResized = (begin: number, svg: SVGTextElement) => () => { updateChordKeyViewX(svg)(scaled(begin)) }

export function buildChordKeySeries(
  romans: IRequiredByChordPartModel[],
  controllers: {
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
    readonly audio: AudioReflectableRegistry
  }
) {
  const children = romans.map(e => {
    const model = getChordKeyModel(e);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svg.id = "key-name";
    svg.style.fontFamily = "Times New Roman";
    svg.style.fontSize = `${chord_text_em}em`;
    svg.style.textAnchor = "end";
    svg.textContent = oneLetterKey(model.scale) + ': ';
    svg.style.fill = getColor(model.tonic)(1, 0.75);

    updateChordKeyViewX(svg)(scaled(model.time.begin))
    updateChordKeyViewY(svg)(PianoRollHeight.get() + chord_text_size + (chord_text_size + chord_name_margin))
    const key = { model, svg }
    return key
  })
  const id = "key-names";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  children.forEach(e => svg.appendChild(e.svg));

  controllers.audio.addListeners(() => children.forEach(e => onWindowResized(e.model.time.begin, e.svg)()));
  controllers.window.addListeners(() => children.forEach(e => onWindowResized(e.model.time.begin, e.svg)));
  controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`))

  return svg;
}