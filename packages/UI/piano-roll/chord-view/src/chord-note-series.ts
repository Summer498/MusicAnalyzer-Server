import { black_key_height, NoteSize, OctaveCount, PianoRollConverter } from "@music-analyzer/view-parameters";
import { Chord, Scale } from "@music-analyzer/tonal-objects";
import { getNote } from "@music-analyzer/tonal-objects";
import { mod } from "@music-analyzer/math";
import { Note } from "@music-analyzer/tonal-objects";
import { fifthToColor, thirdToColor } from "@music-analyzer/color";
import { intervalOf } from "@music-analyzer/tonal-objects";
import { AudioReflectableRegistry, PianoRollTranslateX } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { Time } from "@music-analyzer/time-and";

import { oneLetterKey } from "./shorten/on-letter-key";
import { chord_text_em } from "./chord-view-params/text-em";

interface IRequiredByChordPartModel {
  readonly time: Time
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
}

interface IChordNoteModel {
  readonly time: Time;
  readonly chord: Chord
  readonly scale: Scale
  readonly roman: string
  readonly tonic: string;
  readonly type: string;
  readonly note: number;
  readonly note_name: string;
  readonly interval: string;
  readonly oct: number;
}

const getChordNoteModel = (
  e: IRequiredByChordPartModel,
  note: Note,
  oct: number,
) => ({
  ...e,
  type: e.chord.type,
  note: note.chroma,
  note_name: note.name,
  tonic: e.chord.tonic || "",
  interval: intervalOf(e.chord.tonic || "", note),
  oct,
} as IChordNoteModel)

const updateChordNoteViewX = (svg: SVGRectElement) => (x: number) => { svg.setAttribute("x", String(x)); }
const updateChordNoteViewY = (svg: SVGRectElement) => (y: number) => { svg.setAttribute("y", String(y)); }
const updateChordNoteViewWidth = (svg: SVGRectElement) => (w: number) => { svg.setAttribute("width", String(w)); }
const updateChordNoteViewHeight = (svg: SVGRectElement) => (h: number) => { svg.setAttribute("height", String(h)); }
const getColor = (tonic: string) => (s: number, v: number) => { return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)" }

const scaled = (e: number) => e * NoteSize.get();

const updateChordNoteX = (svg: SVGRectElement, begin: number) => { updateChordNoteViewX(svg)(scaled(begin)) }
const updateChordNoteY = (svg: SVGRectElement, y: number) => { updateChordNoteViewY(svg)(y) }
const updateChordNoteWidth = (svg: SVGRectElement, duration: number) => { updateChordNoteViewWidth(svg)(scaled(duration)) }
const updateChordNoteHeight = (svg: SVGRectElement) => { updateChordNoteViewHeight(svg)(black_key_height) }
const onWindowResized_ChordNote = (svg: SVGRectElement, model: IChordNoteModel) => {
  updateChordNoteX(svg, model.time.begin)
  updateChordNoteWidth(svg, scaled(model.time.duration))
  updateChordNoteHeight(svg)
}

export function buildChordNotesSeries(
  romans: IRequiredByChordPartModel[],
  controllers: {
    readonly audio: AudioReflectableRegistry
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
  }
) {
  const children = romans.map(roman => {
    const model = roman;
    const chord = model.chord;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = chord.name;
    const children = [...Array(OctaveCount.get())].map((_, oct) => {

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svg.id = `${chord.name}-${oct}`;
      const children = chord.notes.map(note => {
        const model = getChordNoteModel(roman, getNote(note), oct);
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        svg.id = "key-name";
        svg.style.fontFamily = "Times New Roman";
        svg.style.fontSize = `${chord_text_em}em`;
        svg.style.textAnchor = "end";
        svg.textContent = oneLetterKey(model.scale) + ': ';
        svg.style.fill = getColor(model.tonic)(1, 0.75);
        svg.style.stroke = "rgb(64, 64, 64)";
        svg.style.fill = thirdToColor(model.note_name, model.tonic, 0.25, 1);
        if (false) {
          svg.style.fill = getColor(model.tonic)(0.25, model.type === "major" ? 1 : 0.9);
        }

        const y = [model.note]
          .map(e => mod(e, 12))
          .map(e => e + 12)
          .map(e => e * model.oct)
          .map(e => PianoRollConverter.midi2BlackCoordinate(e))
        [0]
        updateChordNoteX(svg, model.time.begin)
        updateChordNoteY(svg, y)
        updateChordNoteWidth(svg, scaled(model.time.duration))
        updateChordNoteHeight(svg)
        return { model, svg }
      });
      children.forEach(e => svg.appendChild(e.svg));


      return { svg, children } as const
    });
    children.forEach(e => svg.appendChild(e.svg));

    return { svg, children } as const;
  })
  const id = "chords";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  children.forEach(e => svg.appendChild(e.svg));

  controllers.audio.addListeners(() => children.forEach(e => e.children.forEach(e => e.children.forEach(e => onWindowResized_ChordNote(e.svg, e.model)))));
  controllers.window.addListeners(() => children.forEach(e => e.children.forEach(e => e.children.forEach(e => onWindowResized_ChordNote(e.svg, e.model)))));
  controllers.time_range.addListeners(() => svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`));

  return svg
}