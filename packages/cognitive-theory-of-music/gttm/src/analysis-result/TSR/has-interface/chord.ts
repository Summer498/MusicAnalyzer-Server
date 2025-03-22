import { Note } from "../../common";
import { IChord } from "../interface/i-chord";

export class Chord 
  implements IChord {
  readonly duration: number;
  readonly velocity: number;
  readonly note: Note;
  constructor(chord: IChord) {
    this.duration = chord.duration;
    this.velocity = chord.velocity;
    this.note = chord.note;
  }
  // TODO: get chroma
}
