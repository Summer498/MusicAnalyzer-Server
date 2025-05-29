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

interface RequiredByChordNotesSeries {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
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
  time: e.time,
  chord: e.chord,
  scale: e.scale,
  roman: e.roman,
  tonic: e.chord.tonic || "",
  type: e.chord.type,
  note: note.chroma,
  note_name: note.name,
  interval: intervalOf(e.chord.tonic || "", note),
  oct,
} as IChordNoteModel)

class ChordNoteView {
  constructor(
    readonly svg: SVGRectElement
  ) { }
  updateX(x: number) { this.svg.setAttribute("x", String(x)); }
  updateY(y: number) { this.svg.setAttribute("y", String(y)); }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
}

const getColor = (tonic: string) => (s: number, v: number) => { return fifthToColor(tonic, s, v) || "rgb(0, 0, 0)" }
class ChordNote {
  get svg() { return this.view.svg }
  y: number;
  constructor(
    readonly model: IChordNoteModel,
    readonly view: ChordNoteView,
  ) {
    this.y = [this.model.note]
      .map(e => mod(e, 12))
      .map(e => e + 12)
      .map(e => e * this.model.oct)
      .map(e => PianoRollConverter.midi2BlackCoordinate(e))
    [0]
    this.updateX();
    this.updateY();
    this.updateWidth();
    this.updateHeight();
  }
  updateWidth() { this.view.updateWidth(this.scaled(this.model.time.duration)) }
  updateHeight() { this.view.updateHeight(black_key_height) }
  onWindowResized() {
    this.updateX();
    this.updateWidth();
    this.updateHeight();
  }
  private scaled = (e: number) => e * NoteSize.get();
  updateX() { this.view.updateX(this.scaled(this.model.time.begin)) }
  updateY() { this.view.updateY(this.y) }
  onTimeRangeChanged = this.onWindowResized
  onAudioUpdate = this.onWindowResized;
}

class ChordNotesInOctave {
  readonly svg: SVGGElement
  readonly children: ChordNote[]
  constructor(
    roman: IRequiredByChordPartModel,
    chord: Chord,
    oct: number,
  ) {
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
      const view = new ChordNoteView(svg);
      return new ChordNote(model, view)
    });
    this.svg = svg
    this.children = children
    children.forEach(e => svg.appendChild(e.svg));
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}

class ChordNotes {
  readonly svg: SVGGElement;
  readonly children: ChordNotesInOctave[];
  constructor(
    readonly model: IRequiredByChordPartModel,
  ) {
    const chord = model.chord;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = chord.name;
    const children = [...Array(OctaveCount.get())].map((_, oct) => new ChordNotesInOctave(model, chord, oct));
    children.forEach(e => svg.appendChild(e.svg));
    this.svg = svg
    this.children = children
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}

class ChordNotesSeries {
  readonly svg: SVGGElement
  readonly children_model: { readonly time: Time }[];
  #show: ChordNotes[];
  get show() { return this.#show; };

  constructor(
    romans: IRequiredByChordPartModel[],
    controllers: RequiredByChordNotesSeries
  ) {
    const children = romans.map(roman => {
      return new ChordNotes(roman)
    })
    const id = "chords";
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

export function buildChordNotesSeries(
  romans: IRequiredByChordPartModel[],
  controllers: RequiredByChordNotesSeries
) {
  return new ChordNotesSeries(romans, controllers)
}