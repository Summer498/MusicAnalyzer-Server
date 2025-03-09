import { _Interval, _Note, IntervalName, NoteLiteral } from "@music-analyzer/tonal-objects";
import { RegistralReturnForm, } from "../RegistralReturnForm";
import { _ArchetypeSymbol, ProspectiveTriadSymbol, TriadSymbol } from "./types";
import { retrospectiveSymbol } from "./get-retrospective-symbol";
import { RegistralMotion } from "../MelodyMotion/RegistralMotion";
import { IntervallicMotion } from "../MelodyMotion/IntervallicMotion";

class TriadArchetype {
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
    const Id = this.intervallic_motion.direction.name;
    const Im = this.intervallic_motion.magnitude.name;
    const Vd = this.registral_motion.direction.name;
    const Vm = this.registral_motion.magnitude.name;
    this.registral_return_form = new RegistralReturnForm(this.notes);

    // Reverse
    if ((Vd === "mL" || Id === "mL") && Im === "AB") {
      if (Id !== "mL") { this.symbol = "VR"; }
      else if (Vd !== "mL") { this.symbol = "IR"; }
      else { this.symbol = "R"; }
    }
    // Process / Duplicate
    else {
      if (Im !== "AA") { this.symbol = "VP"; }
      else if (Vm !== "AA") {
        if (Id === "mN") { this.symbol = "ID"; }
        else { this.symbol = "IP"; }
      }
      else if (Vd === "mN") { this.symbol = "D"; }
      else { this.symbol = "P"; }
    }
  }
}

export class Triad {
  readonly symbol: TriadSymbol;
  readonly archetype: TriadArchetype;
  readonly retrospective: boolean;
  readonly notes: [NoteLiteral, NoteLiteral, NoteLiteral];
  constructor(prev: NoteLiteral, curr: NoteLiteral, next: NoteLiteral) {
    this.notes = [prev || "", curr || "", next || ""]
    this.archetype = new TriadArchetype(prev, curr, next);

    this.retrospective = ((archetype: TriadArchetype) => {
      const initial = _Interval.get(this.archetype.intervals[0]);
      const initial_magnitude = Math.abs(initial.num) < 5 ? "aa" : "ab";
      switch (archetype.symbol) {
        case "R":
        case "IR":
        case "VR":
          return initial_magnitude === "aa"
        default:
          return initial_magnitude === "ab"
      }
    })(this.archetype)
    this.symbol = this.retrospective ? retrospectiveSymbol(this.archetype.symbol) : this.archetype.symbol
  }
}
