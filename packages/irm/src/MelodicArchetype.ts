import { _Interval, _Note, IntervalName, NoteLiteral } from "@music-analyzer/tonal-objects";
import { MelodyMotion, no_motion } from "./MelodyMotion";
import {
  NULL_REGISTRAL_RETURN_FORM,
  RegistralReturnForm,
} from "./RegistralReturnForm";


export type TrigramProspectiveSymbol =
  | "P" | "IP" | "VP"
  | "R" | "IR" | "VR"
  | "D" | "ID"

export type RetrospectiveSymbol =
  | "(P)" | "(IP)" | "(VP)"
  | "(R)" | "(IR)" | "(VR)"
  | "(D)" | "(ID)"

export type _ProspectiveSymbol = TrigramProspectiveSymbol | "M" | "dyad"
export type _ArchetypeSymbol = "" | _ProspectiveSymbol | RetrospectiveSymbol
export type ProspectiveSymbol = TrigramProspectiveSymbol | "M" | IntervalName
export type ArchetypeSymbol = "" | ProspectiveSymbol | RetrospectiveSymbol

const retrospectiveSymbol = (symbol: TrigramProspectiveSymbol): RetrospectiveSymbol => {
  switch (symbol) {
    case "P": return "(P)";
    case "IP": return "(IP)";
    case "VP": return "(VP)";
    case "R": return "(R)";
    case "IR": return "(IR)";
    case "VR": return "(VR)";
    case "D": return "(D)";
    case "ID": return "(ID)";
    default: throw new Error(`Illegal symbol given.\nExpected symbol: P, IP, VP, R, IR, VR, D, ID\n Given symbol:${symbol}`);
  }
};

const remove_minus = (src: string) => {
  if (src.length > 0) {
    return src[0] === "-" ? src.slice(1) : src;
  }
  return src;
};

export class Archetype {
  _symbol: _ArchetypeSymbol;
  symbol: ArchetypeSymbol;
  retrospective: boolean;
  registral_return_form: RegistralReturnForm;
  notes: NoteLiteral[];
  intervals: IntervalName[];
  melody_motion: MelodyMotion;

  constructor(notes: (string | undefined)[]) {
    const _notes = notes.map(e => e || "");
    this.notes = _notes;
    const notes_num = _notes.length;
    const has_blank = _notes.find(e => !e);
    if (notes_num !== 3 || has_blank) {
      this.retrospective = false;
      this.registral_return_form = NULL_REGISTRAL_RETURN_FORM;
      this.intervals = ["", ""];
      this.melody_motion = no_motion;
      if (has_blank) {
        this._symbol = "";
        this.symbol = "";
      }
      else if (notes_num === 1) {
        this._symbol = "M";
        this.symbol = "M";
      }
      else if (notes_num === 2) {
        this._symbol = "dyad";
        this.symbol = remove_minus(_Interval.distance(_notes[0], _notes[1]));
      }
      else { throw new Error(`Invalid length of notes. Required 1, 2, or, 3 notes but given was ${_notes.length} notes: ${JSON.stringify(_notes)}`); }
      return;
    }

    this.intervals = [
      _Interval.distance(_notes[0], _notes[1]),
      _Interval.distance(_notes[1], _notes[2]),
    ];

    const initial = _Interval.get(this.intervals[0]);
    const follow = _Interval.get(this.intervals[1]);
    this.melody_motion = new MelodyMotion(initial, follow);
    const i_dir = this.melody_motion.intervallic.direction.name;
    const i_mgn = this.melody_motion.intervallic.magnitude.name;
    const v_dir = this.melody_motion.registral.direction.name;
    const v_mgn = this.melody_motion.registral.magnitude.name;
    this.registral_return_form = new RegistralReturnForm(_notes);

    const initial_magnitude = Math.abs(initial.num) < 5 ? "aa" : "ab";

    // Reverse
    if (i_mgn === "AB" && (i_dir === "mL" || v_dir === "mL")) {
      this.retrospective = initial_magnitude === "aa";
      if (i_dir === "mR") { this._symbol = "VR"; }
      else if (v_dir === "mR") { this._symbol = "IR"; }
      else { this._symbol = "R"; }
    }
    // Duplicate
    else if (i_dir === "mN" && v_dir !== "mR") {
      this.retrospective = initial_magnitude === "ab";
      if (v_dir !== "mN") { this._symbol = "ID"; }
      else { this._symbol = "D"; }
    }
    // Process
    else {
      this.retrospective = initial_magnitude === "ab";
      if (i_mgn === "AB") { this._symbol = "VP"; }
      else if (v_mgn === "AB") { this._symbol = "IP"; }
      else { this._symbol = "P"; }
    }
    if (this.retrospective) {
      this._symbol = retrospectiveSymbol(this._symbol);
    }
    this.symbol = this._symbol;
  }
}
