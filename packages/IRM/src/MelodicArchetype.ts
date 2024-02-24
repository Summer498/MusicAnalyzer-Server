import { _Interval, NoteLiteral } from "../../TonalObjects";
import { MelodyMotion, no_motion } from "./MelodyMotion";
import {
  NULL_REGISTRAL_RETURN_FORM,
  RegistralReturnForm,
} from "./RegistralReturnForm";
import { mL, mN, mR } from "./Direction";
import { AB } from "./Magnitude";

// console.log(Note.get("C"));
// console.log(Interval.distance("C4", "G4"));
// console.log(Interval.distance("G4", "C4")); // 符号付き音程が取れる
// console.log(Interval.semitones(Interval.distance("G4", "C4"))); // 符号付き音程クロマも取れる

// テスト用
// const octave = ["Cb","C","C#","Db","D","D#","Eb","E","E#","Fb","F","F#","Gb","G","G#","Ab","A","A#","Bb","B","B#",];

const P5 = _Interval.get("P5");
const P4 = _Interval.get("P4");
const T = _Interval.get("T");

type TInterval = ReturnType<typeof _Interval.get>;
export type ArchetypeSymbol =
  | "P" | "IP" | "VP"
  | "R" | "IR" | "VR"
  | "D" | "ID"
  | "M" | "dyad";

export class Archetype {
  symbol: ArchetypeSymbol;
  retrospective: boolean | null;
  registral_return_form: RegistralReturnForm;
  notes: NoteLiteral[];
  intervals: TInterval[];
  melody_motion: MelodyMotion;

  constructor(notes: string[]) {
    this.notes = notes;
    const notes_num = notes.length;
    if (notes_num !== 3) {
      this.retrospective = false;
      this.registral_return_form = NULL_REGISTRAL_RETURN_FORM;
      this.intervals = [_Interval.get(""), _Interval.get("")];
      this.melody_motion = no_motion;
      if (notes_num === 1) { this.symbol = "M"; }
      else if (notes_num === 2) { this.symbol = "dyad"; }
      else { throw new Error(`Invalid length of notes. Required 1, 2, or, 3 notes but given was ${notes.length} notes: ${JSON.stringify(notes)}`); }
    }

    this.intervals = [
      _Interval.get(_Interval.distance(notes[0], notes[1])),
      _Interval.get(_Interval.distance(notes[1], notes[2])),
    ];

    this.melody_motion = new MelodyMotion(this.intervals[0], this.intervals[1]);
    const initial = this.intervals[0];
    const i_dir = this.melody_motion.intervallic_motion_direction;
    const i_mgn = this.melody_motion.intervallic_motion_magnitude;
    const v_mgn = this.melody_motion.registral_motion_magnitude;
    this.registral_return_form = new RegistralReturnForm(notes);

    // Reverse
    if (i_mgn === AB && (i_dir === mL || v_mgn === mL)) {
      this.retrospective = initial.chroma < T.chroma;
      if (i_dir === mR) { this.symbol = "VR"; }
      else if (v_mgn === mR) { this.symbol = "IR"; }
      else { this.symbol = "R"; }
    }
    // Duplicate
    else if (i_dir === mN && v_mgn !== mR) {
      this.retrospective = T.chroma < initial.chroma;
      if (v_mgn !== mN) { this.symbol = "ID"; }
      else { this.symbol = "D"; }
    }
    // Process
    else {
      this.retrospective = T.chroma < initial.chroma;
      if (i_mgn === AB) { this.symbol = "VP"; }
      else if (v_mgn === AB) { this.symbol = "IP"; }
      else { this.symbol = "VP"; }
    }
    if (P4.chroma <= initial.chroma && initial.chroma < P5.chroma) {
      this.retrospective = null;
    }

  }
}
