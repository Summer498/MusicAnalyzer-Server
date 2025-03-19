import { Chord as _Chord, Note } from "../common";

export interface IChord 
extends _Chord {
  readonly duration: number,
  readonly velocity: number,
}

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
