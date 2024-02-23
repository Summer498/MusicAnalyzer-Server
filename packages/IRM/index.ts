import { Interval } from "tonal";
import { ParametricScale } from "./src/ParametricScale";
import { NULL_REGISTRAL_RETURN_FORM, RegistralReturnForm } from "./src/RegistralReturnForm";
import { mL, mN, mR } from "./src/Direction";
import { AB } from "./src/Magnitude";

// console.log(Note.get("C"));
// console.log(Interval.distance("C4", "G4"));
// console.log(Interval.distance("G4", "C4")); // 符号付き音程が取れる
// console.log(Interval.semitones(Interval.distance("G4", "C4"))); // 符号付き音程クロマも取れる

// テスト用
// const octave = ["Cb","C","C#","Db","D","D#","Eb","E","E#","Fb","F","F#","Gb","G","G#","Ab","A","A#","Bb","B","B#",];

type NoteLiteral = string; // TODO: import form tonal / define by myself
// type IntervalLiteral = string;  // TODO: import from tonal / define by myself
// type TNote = ReturnType<typeof Note.get>;
type TInterval = ReturnType<typeof Interval.get>;
type ArchetypeSymbol =
  | "P" | "IP" | "VP"
  | "R" | "IR" | "VR"
  | "D" | "ID"
  | "M" | "dyad";

export class Archetype {
  symbol: ArchetypeSymbol;
  retrospective: boolean | null;
  intervallic_closure: number;
  registral_closure: number;
  registral_return_form: RegistralReturnForm;
  notes: NoteLiteral[];
  intervals: TInterval[];

  constructor(notes: string[]) {
    this.notes = notes;
    const notes_num = notes.length;
    if (notes_num !== 3) {
      this.retrospective = false;
      this.intervallic_closure = 0;
      this.registral_closure = 0;
      this.registral_return_form = NULL_REGISTRAL_RETURN_FORM;
      this.intervals = [Interval.get(""), Interval.get("")];
      if (notes_num === 1) { this.symbol = "M"; }
      else if (notes_num === 2) { this.symbol = "dyad"; }
      else { throw new Error(`Invalid length of notes. Required 1, 2, or, 3 notes but given was ${notes.length} notes: ${notes}`,); }
    }
    else {
      this.intervals = [
        Interval.get(Interval.distance(notes[0], notes[1])),
        Interval.get(Interval.distance(notes[1], notes[2])),
      ];
      const parametric_scale = new ParametricScale(this.intervals[0], this.intervals[1]);
      const i_dir = parametric_scale.intervallic_motion_direction;
      const i_mgn = parametric_scale.intervallic_motion_magnitude;
      const v_dir = parametric_scale.registral_motion_direction;
      const v_mgn = parametric_scale.registral_motion_magnitude;
      this.registral_return_form = new RegistralReturnForm(notes);


      const init_mgn = Math.abs(this.intervals[0].chroma);
      if (i_mgn == AB && (i_dir === mL || v_dir === mL)) {
        this.retrospective = init_mgn < 6;  //init_mgn = ab
        if (i_dir === mR) { this.symbol = "VR"; }
        else if (v_dir === mR) { this.symbol = "IR"; }
        else { this.symbol = "R"; }
      }
      else if (i_dir === mN && v_dir !== mR) {
        this.retrospective = init_mgn > 6;  //init_mgn = aa
        if (v_dir !== mN) { this.symbol = "ID"; }
        else { this.symbol = "D"; }
      }
      else {
        this.retrospective = init_mgn > 6;  //init_mgn = aa
        if (i_mgn === AB) { this.symbol = "VP"; }
        else if (v_mgn === AB) { this.symbol = "IP"; }
        else { this.symbol = "P"; }
      }
      // TODO: 5(P4) は aa として扱ってよさそうな気がする
      if (5 <= init_mgn && init_mgn <= 6) { this.retrospective = null; }

      this.intervallic_closure = i_dir === mL && i_mgn === AB ? 1 : 0;
      this.registral_closure = v_dir === mL && v_mgn === AB ? 1 : 0;
    }
  }
}
