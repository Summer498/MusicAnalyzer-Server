import { _Interval, _Note, IntervalName, NoteLiteral } from "@music-analyzer/tonal-objects";
import { TriadSymbol } from "../types";
import { retrospectiveSymbol } from "../get-retrospective-symbol";
import { TriadArchetype } from "./triad-archetype";
import { IntervallicMotion, RegistralMotion } from "../../MelodyMotion";
import { RegistralReturnForm } from "../../RegistralReturnForm";


const isRetrospective = (archetype: TriadArchetype) => {
  const initial = _Interval.get(archetype.intervals[0]);
  const init_mgn = Math.abs(initial.num) < 5 ? "aa" : "ab";
  switch (archetype.symbol) {
    case "R":
    case "IR":
    case "VR":
      return init_mgn === "aa"
    default:
      return init_mgn === "ab"
  }
}

export class Triad {
  readonly length = 3;
  readonly symbol: TriadSymbol;
  readonly notes: [NoteLiteral, NoteLiteral, NoteLiteral];
  readonly intervals: [IntervalName, IntervalName];
  readonly registral: RegistralMotion;
  readonly intervallic: IntervallicMotion;
  readonly registral_return_form: RegistralReturnForm;
  readonly archetype: TriadArchetype;
  readonly retrospective: boolean;
  constructor(prev: NoteLiteral, curr: NoteLiteral, next: NoteLiteral) {
    this.notes = [prev || "", curr || "", next || ""]
    this.archetype = new TriadArchetype(prev, curr, next);
    const { intervals, registral, intervallic, registral_return_form } = this.archetype;
    this.intervals = intervals;
    this.registral = registral;
    this.intervallic = intervallic;
    this.registral_return_form = registral_return_form;
    this.retrospective = isRetrospective(this.archetype);
    this.symbol = this.retrospective ? retrospectiveSymbol(this.archetype.symbol) : this.archetype.symbol
  }
}
