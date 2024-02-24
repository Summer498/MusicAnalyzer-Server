import { _Interval, _Note, NoteLiteral } from "../../TonalObjects";
import { Interval } from "../../TonalObjects";

export class RegistralReturnForm {
  is_null: boolean;
  notes: NoteLiteral[];
  return_degree: Interval;
  constructor(notes: NoteLiteral[]) {
    this.is_null = true;
    if (notes.length !== 3) { throw new Error(`Invalid argument length. Required 3 arguments but given was ${notes.length} notes: ${JSON.stringify(notes)}`,); }
    this.notes = notes;
    if (_Note.get(notes[0]) === _Note.get("")) {
      // null object
      this.return_degree = _Interval.get("");
      return;
    }
    this.return_degree = _Interval.get(_Interval.distance(notes[2], notes[0]));
    const dir1 = Math.sign(
      _Interval.semitones(_Interval.distance(notes[0], notes[1])),
    );
    const dir2 = Math.sign(
      _Interval.semitones(_Interval.distance(notes[1], notes[2])),
    );
    this.is_null = dir1 === dir2; // TODO: 0 のときに registral return と判定されるかどうか本を確認する 
  }
}

export const NULL_REGISTRAL_RETURN_FORM = new RegistralReturnForm(["", "", ""]);
