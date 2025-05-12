import { RequiredByChordNoteModel, RequiredByChordNotesSeries } from "./r-chord-note-series";
import { ChordPart, ChordPartModel, ChordPartSeries, ChordPartView_impl } from "../chord-parts-series";
import { MVVM_Collection_Impl } from "@music-analyzer/view";
import { black_key_height, OctaveCount, PianoRollConverter } from "@music-analyzer/view-parameters";
import { Chord } from "@music-analyzer/tonal-objects";
import { getNote } from "@music-analyzer/tonal-objects";
import { mod } from "@music-analyzer/math";
import { Note } from "@music-analyzer/tonal-objects";
import { thirdToColor } from "@music-analyzer/color";
import { intervalOf } from "@music-analyzer/tonal-objects";

export class ChordNoteModel 
  extends ChordPartModel {
  readonly tonic: string;
  readonly type: string;
  readonly note: number;
  readonly note_name: string;
  readonly interval: string;
  constructor(
    e: RequiredByChordNoteModel,
    note: Note,
    readonly oct: number,
  ) {
    super(e);
    this.tonic = e.chord.tonic || "";
    this.type = e.chord.type;
    this.note = note.chroma;
    this.note_name = note.name;
    this.interval = intervalOf(this.tonic, note);
  }
}

export class ChordNoteView 
  extends ChordPartView_impl<"rect"> {
  constructor(model: ChordNoteModel) {
    super("rect", model);
    this.svg.style.stroke = "rgb(64, 64, 64)";
    this.svg.style.fill = thirdToColor(
      model.note_name,
      this.model.tonic,
      0.25,
      1
    );
    if (false) {
      this.svg.style.fill = this.getColor(0.25, model.type === "major" ? 1 : 0.9);
    }
  }
  updateWidth(w:number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h:number) { this.svg.setAttribute("height", String(h)); }
}

export class ChordNote
  extends ChordPart<ChordNoteModel, ChordNoteView> {
  y: number;
  constructor(
    e: RequiredByChordNoteModel,
    note: Note,
    oct: number,
  ) {
    const model = new ChordNoteModel(e, note, oct);
    super(model, new ChordNoteView(model));
    this.y =
      PianoRollConverter.convertToCoordinate(mod(-PianoRollConverter.transposed(this.model.note), 12))
      + PianoRollConverter.convertToCoordinate(12 * this.model.oct);
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
  onAudioUpdate = this.onWindowResized;
}

export class ChordNotesInOctave
  extends MVVM_Collection_Impl<ChordNote> {
  constructor(
    roman: RequiredByChordNoteModel,
    chord: Chord,
    oct: number,
  ) {
    super(`${chord.name}-${oct}`, chord.notes.map(note => new ChordNote(roman, getNote(note), oct)));
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}

export class ChordNotes
  extends MVVM_Collection_Impl<ChordNotesInOctave> {
  constructor(
    readonly model: RequiredByChordNoteModel,
  ) {
    const chord = model.chord;
    super(chord.name, [...Array(OctaveCount.get())].map((_, oct) => new ChordNotesInOctave(model, chord, oct)));
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}

export class ChordNotesSeries
  extends ChordPartSeries<ChordNotes> {
  constructor(
    romans: RequiredByChordNoteModel[],
    controllers: RequiredByChordNotesSeries
  ) {
    super("chords", controllers, romans.map(roman => new ChordNotes(roman)));
  }
}
