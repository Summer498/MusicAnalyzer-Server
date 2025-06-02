import { retrospectiveSymbol } from "../get-retrospective-symbol";
import { TriadArchetype } from "./triad-archetype";
import { TriadSymbol } from "../symbols";
import { IntervallicMotion } from "../../MelodyMotion";
import { RegistralMotion } from "../../MelodyMotion";
import { RegistralReturnForm } from "../../RegistralReturnForm";
import { getInterval } from "@music-analyzer/tonal-objects";
import { IntervalName } from "@music-analyzer/tonal-objects";
import { NoteLiteral } from "@music-analyzer/tonal-objects";


const isRetrospective = (archetype: TriadArchetype) => {
  const initial = getInterval(archetype.intervals[0]);
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

export interface Triad {
  readonly length: 3;
  readonly symbol: TriadSymbol;
  readonly notes: [NoteLiteral, NoteLiteral, NoteLiteral];
  readonly intervals: [IntervalName, IntervalName];
  readonly registral: RegistralMotion;
  readonly intervallic: IntervallicMotion;
  readonly registral_return_form: RegistralReturnForm;
  readonly archetype: TriadArchetype;
  readonly retrospective: boolean;
}

export const getTriad = (prev: NoteLiteral, curr: NoteLiteral, next: NoteLiteral) => {
  const archetype = new TriadArchetype(prev, curr, next)
  const { intervals, registral, intervallic, registral_return_form } = archetype;
  const retrospective = isRetrospective(archetype);

  return {
    notes: [prev || "", curr || "", next || ""],
    archetype,
    intervals,
    registral,
    intervallic,
    registral_return_form,
    retrospective,
    symbol: retrospective ? retrospectiveSymbol(archetype.symbol) : archetype.symbol,
  } as Triad
}
