import { ChordPart, ChordPartModel, ChordPartSeries, ChordPartView_impl, getColor } from "./chord-parts-series";
import { MVVM_Collection_Impl } from "@music-analyzer/view";
import { black_key_height, OctaveCount, PianoRollConverter } from "@music-analyzer/view-parameters";
import { Chord } from "@music-analyzer/tonal-objects";
import { getNote } from "@music-analyzer/tonal-objects";
import { mod } from "@music-analyzer/math";
import { Note } from "@music-analyzer/tonal-objects";
import { thirdToColor } from "@music-analyzer/color";
import { intervalOf } from "@music-analyzer/tonal-objects";

import { AudioReflectableRegistry } from "@music-analyzer/view";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { TimeRangeController } from "@music-analyzer/controllers";
import { RequiredByChordPartModel } from "./require-by-chord-part-model";

interface RequiredByChordNotesSeries {
  readonly audio: AudioReflectableRegistry
  readonly window: WindowReflectableRegistry,
  readonly time_range: TimeRangeController,
}

class ChordNoteModel
  extends ChordPartModel {
  readonly tonic: string;
  readonly type: string;
  readonly note: number;
  readonly note_name: string;
  readonly interval: string;
  constructor(
    e: RequiredByChordPartModel,
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

class ChordNoteView
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
      this.svg.style.fill = getColor(this.model.tonic)(0.25, model.type === "major" ? 1 : 0.9);
    }
  }
  updateWidth(w: number) { this.svg.setAttribute("width", String(w)); }
  updateHeight(h: number) { this.svg.setAttribute("height", String(h)); }
}

class ChordNote
  extends ChordPart<ChordNoteModel, ChordNoteView> {
  get svg() { return this.view.svg }
  y: number;
  constructor(
    e: RequiredByChordPartModel,
    note: Note,
    oct: number,
  ) {
    const model = new ChordNoteModel(e, note, oct);
    const view = new ChordNoteView(model);
    super(model, view);
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
  onAudioUpdate = this.onWindowResized;
}

class ChordNotesInOctave
  extends MVVM_Collection_Impl<ChordNote> {
  constructor(
    roman: RequiredByChordPartModel,
    chord: Chord,
    oct: number,
  ) {
    super(`${chord.name}-${oct}`, chord.notes.map(note => new ChordNote(roman, getNote(note), oct)));
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()) }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
}

class ChordNotes
  extends MVVM_Collection_Impl<ChordNotesInOctave> {
  constructor(
    readonly model: RequiredByChordPartModel,
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
    romans: RequiredByChordPartModel[],
    controllers: RequiredByChordNotesSeries
  ) {
    super("chords", controllers, romans.map(roman => new ChordNotes(roman)));
  }
}
