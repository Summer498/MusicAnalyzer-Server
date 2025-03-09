import { _Interval, _Note, IntervalName, NoteLiteral } from "@music-analyzer/tonal-objects";
import { NULL_REGISTRAL_RETURN_FORM, RegistralReturnForm, } from "../RegistralReturnForm";
import { _ArchetypeSymbol, ArchetypeSymbol } from "./types";
import { Triad } from "./Triad";
import { Dyad } from "./Dyad";
import { Monad } from "./Monad";
import { RegistralMotion } from "../MelodyMotion/RegistralMotion";
import { IntervallicMotion } from "../MelodyMotion/IntervallicMotion";

const remove_minus = (src: string) => {
  if (src.length > 0) {
    return src[0] === "-" ? src.slice(1) : src;
  }
  return src;
};

const getArchetype = (
  ...args
    : [NoteLiteral]
    | [NoteLiteral, NoteLiteral]
    | [NoteLiteral, NoteLiteral, NoteLiteral]
) => {
  const e = args;
  if (e.length === 3) {
    return new Triad(e[0], e[1], e[2]);
  }
  else if (e.length === 2) {
    return new Dyad(e[0], e[1]);
  }
  else if (e.length === 1) {
    return new Monad(e[0]);
  }
}

export class Archetype {
  readonly symbol: ArchetypeSymbol;
  readonly notes: NoteLiteral[];
  readonly intervals: IntervalName[];
  readonly retrospective: boolean;
  readonly registral_return_form: RegistralReturnForm;
  readonly registral_motion: RegistralMotion;
  readonly intervallic_motion: IntervallicMotion;

  constructor(prev?: NoteLiteral, curr?: NoteLiteral, next?: NoteLiteral) {
    this.notes = [prev, curr, next].map(e => e || "");
    if (prev && curr && next) {
      const e = new Triad(prev, curr, next);
      this.symbol = e.symbol;
      this.retrospective = e.retrospective;
      this.registral_return_form = e.archetype.registral_return_form;
      this.intervals = e.archetype.intervals;
      this.registral_motion = e.archetype.registral_motion
      this.intervallic_motion = e.archetype.intervallic_motion
    }
    else {
      this.retrospective = false;
      this.registral_return_form = NULL_REGISTRAL_RETURN_FORM;
      this.intervals = ["", ""];
      const P1 = _Interval.get("P1");
      this.registral_motion = new RegistralMotion(P1,P1)
      this.intervallic_motion = new RegistralMotion(P1,P1)
      if (prev && curr) {
        this.symbol = remove_minus(_Interval.distance(prev, curr));
      }
      else if (curr && next) {
        this.symbol = remove_minus(_Interval.distance(curr, next));
      }
      else if (prev || curr || next) {
        this.symbol = "M";
      }
      else {
        this.symbol = "";
      }
    }
  }
}
