import { _Interval, _Note, IntervalName, NoteLiteral } from "@music-analyzer/tonal-objects";
import { MelodyMotion, no_motion } from "./MelodyMotion";
import {
  NULL_REGISTRAL_RETURN_FORM,
  RegistralReturnForm,
} from "./RegistralReturnForm";

const P5 = _Interval.get("P5");
const P4 = _Interval.get("P4");
const Tritone = _Interval.get("T");

export type TrigramProspectiveSymbol =
  | "P" | "IP" | "VP"
  | "R" | "IR" | "VR"
  | "D" | "ID"

export type RetrospectiveSymbol =
  | "(P)" | "(IP)" | "(VP)"
  | "(R)" | "(IR)" | "(VR)"
  | "(D)" | "(ID)"

export type _ProspectiveSymbol = TrigramProspectiveSymbol | "M" | "dyad"
export type _ArchetypeSymbol = _ProspectiveSymbol | RetrospectiveSymbol
export type ProspectiveSymbol = TrigramProspectiveSymbol | "M" | IntervalName
export type ArchetypeSymbol = ProspectiveSymbol | RetrospectiveSymbol

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

export class Archetype {
  _symbol: _ArchetypeSymbol;
  symbol: ArchetypeSymbol;
  retrospective: boolean | null;
  registral_return_form: RegistralReturnForm;
  notes: NoteLiteral[];
  intervals: IntervalName[];
  melody_motion: MelodyMotion;

  constructor(notes: string[]) {
    this.notes = notes;
    const notes_num = notes.length;
    if (notes_num !== 3) {
      this.retrospective = false;
      this.registral_return_form = NULL_REGISTRAL_RETURN_FORM;
      this.intervals = ["", ""];
      this.melody_motion = no_motion;
      if (notes_num === 1) {
        this._symbol = "M";
        this.symbol = "M";
      }
      else if (notes_num === 2) {
        this._symbol = "dyad";
        this.symbol = _Interval.distance(notes[0], notes[1]);
      }
      else { throw new Error(`Invalid length of notes. Required 1, 2, or, 3 notes but given was ${notes.length} notes: ${JSON.stringify(notes)}`); }
      return;
    }

    this.intervals = [
      _Interval.distance(notes[0], notes[1]),
      _Interval.distance(notes[1], notes[2]),
    ];

    const initial = _Interval.get(this.intervals[0]);
    const follow = _Interval.get(this.intervals[1]);
    this.melody_motion = new MelodyMotion(initial, follow);
    const i_dir = this.melody_motion.intervallic.direction.name;
    const i_mgn = this.melody_motion.intervallic.magnitude.name;
    const v_dir = this.melody_motion.registral.direction.name;
    const v_mgn = this.melody_motion.registral.magnitude.name;
    this.registral_return_form = new RegistralReturnForm(notes);

    // Reverse
    if (i_mgn === "AB" && (i_dir === "mL" || v_dir === "mL")) {
      this.retrospective = initial.chroma < Tritone.chroma;
      if (i_dir === "mR") { this._symbol = "VR"; }
      else if (v_dir === "mR") { this._symbol = "IR"; }
      else { this._symbol = "R"; }
    }
    // Duplicate
    else if (i_dir === "mN" && v_dir !== "mR") {
      this.retrospective = Tritone.chroma < initial.chroma;
      if (v_dir !== "mN") { this._symbol = "ID"; }
      else { this._symbol = "D"; }
    }
    // Process
    else {
      this.retrospective = Tritone.chroma < initial.chroma;
      if (i_mgn === "AB") { this._symbol = "VP"; }
      else if (v_mgn === "AB") { this._symbol = "IP"; }
      else { this._symbol = "P"; }
    }
    if (P4.chroma <= initial.chroma && initial.chroma < P5.chroma) {
      this.retrospective = null;
    }
    if (this.retrospective) {
      console.error("retrospective");
      this._symbol = retrospectiveSymbol(this._symbol);
    }
    this.symbol = this._symbol;
  }
}
