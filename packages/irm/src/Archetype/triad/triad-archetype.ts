import { _Interval, _Note, IntervalName, NoteLiteral } from "@music-analyzer/tonal-objects";
import { RegistralReturnForm, } from "../../RegistralReturnForm";
import { ProspectiveTriadSymbol } from "../types";
import { RegistralMotion } from "../../MelodyMotion/RegistralMotion";
import { IntervallicMotion } from "../../MelodyMotion/IntervallicMotion";
import { getTriadArchetypeSymbol } from "./get-triad-archetype-symbol";

export class TriadArchetype {
  readonly symbol: ProspectiveTriadSymbol;
  readonly registral_return_form: RegistralReturnForm;
  readonly notes: [NoteLiteral, NoteLiteral, NoteLiteral];
  readonly intervals: [IntervalName, IntervalName];
  readonly registral_motion: RegistralMotion;
  readonly intervallic_motion: IntervallicMotion;
  constructor(prev: NoteLiteral, curr: NoteLiteral, next: NoteLiteral) {
    this.notes = [prev || "", curr || "", next || ""]
    this.intervals = [_Interval.distance(prev, curr), _Interval.distance(curr, next),];
    const initial = _Interval.get(this.intervals[0]);
    const follow = _Interval.get(this.intervals[1]);
    this.registral_motion = new RegistralMotion(initial, follow);
    this.intervallic_motion = new IntervallicMotion(initial, follow);
    this.registral_return_form = new RegistralReturnForm(this.notes);
    this.symbol = getTriadArchetypeSymbol(
      this.intervallic_motion.direction.name,
      this.intervallic_motion.magnitude.name,
      this.registral_motion.direction.name,
    );
  }
}
