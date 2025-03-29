import { Note } from "@music-analyzer/tonal-objects/src/note/note";
import { intervalOf } from "@music-analyzer/tonal-objects/src/interval/distance";
import { RequiredByChordNoteModel } from "./r-chord-note-model";
import { ChordPartModel } from "./chord-part-model";

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
