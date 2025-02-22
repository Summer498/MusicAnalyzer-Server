import { _Interval, _Note, IntervalName, NoteLiteral } from "@music-analyzer/tonal-objects";
import { MelodyMotion } from "../MelodyMotion";
import { RegistralReturnForm, } from "../RegistralReturnForm";
import { get_color_on_intervallic_angle } from "../colors.ts";
import { _ArchetypeSymbol, ArchetypeSymbol } from "./types";
import { retrospectiveSymbol } from "./get-retrospective-symbol";

export class Archetype3 {
  readonly _symbol: _ArchetypeSymbol;
  readonly symbol: ArchetypeSymbol;
  readonly retrospective: boolean;
  readonly registral_return_form: RegistralReturnForm;
  readonly notes: NoteLiteral[];
  readonly intervals: IntervalName[];
  readonly melody_motion: MelodyMotion;
  readonly color: string;
  constructor(prev: NoteLiteral, curr: NoteLiteral, next: NoteLiteral) {
    this.notes = [prev, curr, next].map(e => e || "");
    this.intervals = [
      _Interval.distance(prev, curr),
      _Interval.distance(curr, next),
    ];

    this.color = get_color_on_intervallic_angle(prev, curr, next);
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
    if ((v_dir === "mL" || i_dir === "mL") && i_mgn === "AB") {
      this.retrospective = initial_magnitude === "aa";
      if (i_dir !== "mL") { this._symbol = "VR"; }
      else if (v_dir !== "mL") { this._symbol = "IR"; }
      else { this._symbol = "R"; }
    }
    // Process / Duplicate
    else {
      this.retrospective = initial_magnitude === "ab";
      if (i_mgn !== "AA") { this._symbol = "VP"; }
      else if (v_mgn !== "AA") {
        if (i_dir === "mN") { this._symbol = "ID"; }
        else { this._symbol = "IP"; }
      }
      else if (v_dir === "mN") { this._symbol = "D"; }
      else { this._symbol = "P"; }
    }
    if (this.retrospective) {
      this._symbol = retrospectiveSymbol(this._symbol);
    }
    this.symbol = this._symbol;
  }
}
