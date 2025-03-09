import { _Interval, _Note, NoteLiteral } from "@music-analyzer/tonal-objects";
import { TriadSymbol } from "../types";
import { retrospectiveSymbol } from "../get-retrospective-symbol";
import { TriadArchetype } from "./triad-archetype";


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
  readonly symbol: TriadSymbol;
  readonly archetype: TriadArchetype;
  readonly retrospective: boolean;
  readonly notes: [NoteLiteral, NoteLiteral, NoteLiteral];
  constructor(prev: NoteLiteral, curr: NoteLiteral, next: NoteLiteral) {
    this.notes = [prev || "", curr || "", next || ""]
    this.archetype = new TriadArchetype(prev, curr, next);
    this.retrospective = isRetrospective(this.archetype);
    this.symbol = this.retrospective ? retrospectiveSymbol(this.archetype.symbol) : this.archetype.symbol
  }
}
