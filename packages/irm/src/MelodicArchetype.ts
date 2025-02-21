import { _Interval, _Note, IntervalName, NoteLiteral } from "@music-analyzer/tonal-objects";
import { MelodyMotion, no_motion } from "./MelodyMotion";
import {
  NULL_REGISTRAL_RETURN_FORM,
  RegistralReturnForm,
} from "./RegistralReturnForm";
import { get_color_on_intervallic_angle } from "./ArchetypeColor";

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
  readonly _symbol: _ArchetypeSymbol;
  readonly symbol: ArchetypeSymbol;
  readonly retrospective: boolean;
  readonly registral_return_form: RegistralReturnForm;
  readonly notes: NoteLiteral[];
  readonly intervals: IntervalName[];
  readonly melody_motion: MelodyMotion;
  readonly color: string;

  constructor(prev?: NoteLiteral, curr?: NoteLiteral, next?: NoteLiteral) {
    this.notes = [prev, curr, next].map(e => e || "");
    if (prev && curr && next) {
      this.intervals = [
        _Interval.distance(prev, curr),
        _Interval.distance(curr, next),
      ];

      this.color = get_color_on_intervallic_angle(this.notes);
      const initial = _Interval.get(this.intervals[0]);
      const follow = _Interval.get(this.intervals[1]);
      this.melody_motion = new MelodyMotion(initial, follow);
      const i_dir = this.melody_motion.intervallic.direction.name;
      const i_mgn = this.melody_motion.intervallic.magnitude.name;
      const v_dir = this.melody_motion.registral.direction.name;
      const v_mgn = this.melody_motion.registral.magnitude.name;
      this.registral_return_form = new RegistralReturnForm(this.notes);

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
    else {
      this.retrospective = false;
      this.registral_return_form = NULL_REGISTRAL_RETURN_FORM;
      this.intervals = ["", ""];
      this.melody_motion = no_motion;
      this.color = "#000";
      if (prev && curr) {
        this._symbol = "dyad";
        this.symbol = remove_minus(_Interval.distance(prev, curr));
      }
      else if (curr && next) {
        this._symbol = "dyad";
        this.symbol = remove_minus(_Interval.distance(curr, next));
      }
      else if (prev || curr || next) {
        this._symbol = "M";
        this.symbol = "M";
      }
      else {
        this._symbol = "";
        this.symbol = "";
      }
    }
  }
}
