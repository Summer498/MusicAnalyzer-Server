import { getNote } from "./facade";
import { getSemitones } from "./facade";
import { intervalOf } from "./facade";
import { NoteLiteral } from "./facade";

export class RegistralReturnForm {
  readonly is_null;
  readonly return_degree;
  constructor(notes: NoteLiteral[]) {
    this.is_null = true;
    if (notes.length !== 3) { throw new Error(`Invalid argument length. Required 3 arguments but given was ${notes.length} notes: ${JSON.stringify(notes)}`,); }
    if (getNote(notes[0]) === getNote("")) {
      // null object
      this.return_degree = ""; //_Interval.get("");
      return;
    }
    this.return_degree = intervalOf(notes[0], notes[2]); //_Interval.get(_Interval.distance(notes[2], notes[0]));
    const dir1 = Math.sign(
      getSemitones(intervalOf(notes[0], notes[1])),
    );
    const dir2 = Math.sign(
      getSemitones(intervalOf(notes[1], notes[2])),
    );
    this.is_null = dir1 === dir2;
  }
}

export const NULL_REGISTRAL_RETURN_FORM = new RegistralReturnForm(["", "", ""]);
