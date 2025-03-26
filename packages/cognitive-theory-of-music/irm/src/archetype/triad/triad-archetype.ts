import { _Interval } from "@music-analyzer/tonal-objects";
import { IntervalName } from "@music-analyzer/tonal-objects";
import { NoteLiteral } from "@music-analyzer/tonal-objects";
import { RegistralReturnForm, } from "../../RegistralReturnForm";
import { ProspectiveTriadSymbol } from "../types";
import { IntervallicMotion } from "../../MelodyMotion";
import { RegistralMotion } from "../../MelodyMotion";
import { getTriadArchetypeSymbol } from "./get-triad-archetype-symbol";

export class TriadArchetype {
  readonly symbol: ProspectiveTriadSymbol;
  readonly notes: [NoteLiteral, NoteLiteral, NoteLiteral];
  readonly intervals: [IntervalName, IntervalName];
  readonly registral: RegistralMotion;
  readonly intervallic: IntervallicMotion;
  readonly registral_return_form: RegistralReturnForm;
  constructor(prev: NoteLiteral, curr: NoteLiteral, next: NoteLiteral) {
    this.notes = [prev || "", curr || "", next || ""]
    this.intervals = [_Interval.distance(prev, curr), _Interval.distance(curr, next),];
    const initial = _Interval.get(this.intervals[0]);
    const follow = _Interval.get(this.intervals[1]);
    this.registral = new RegistralMotion(initial, follow);
    this.intervallic = new IntervallicMotion(initial, follow);
    this.registral_return_form = new RegistralReturnForm(this.notes);
    this.symbol = getTriadArchetypeSymbol(
      this.intervallic.direction.name,
      this.intervallic.magnitude.name,
      this.registral.direction.name,
    );
  }
}
