import { _Interval, _Note, IntervalName, NoteLiteral } from "@music-analyzer/tonal-objects";
import { NULL_REGISTRAL_RETURN_FORM, RegistralReturnForm, } from "../RegistralReturnForm";
import { _ArchetypeSymbol, ArchetypeSymbol } from "./types";
import { Triad } from "./triad/Triad";
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
  switch (e.length) {
    case 1: return new Monad(e[0]);
    case 2: return new Dyad(e[0], e[1]);
    case 3: return new Triad(e[0], e[1], e[2]);
    default: throw new Error(`Invalid argument length: ${args.length}`)
  }
}

export class Archetype {
  readonly symbol: ArchetypeSymbol;
  readonly notes
    : []
    | [NoteLiteral]
    | [NoteLiteral, NoteLiteral]
    | [NoteLiteral, NoteLiteral, NoteLiteral];
  readonly intervals: [IntervalName, IntervalName];
  readonly retrospective: boolean;
  readonly registral_return_form: RegistralReturnForm;
  readonly registral_motion: RegistralMotion;
  readonly intervallic_motion: IntervallicMotion;

  constructor(prev?: NoteLiteral, curr?: NoteLiteral, next?: NoteLiteral) {
    if (prev && curr && next) {
      this.notes = [prev, curr, next]
      const { symbol, retrospective, archetype } = new Triad(prev, curr, next);
      this.symbol = symbol;
      this.retrospective = retrospective;
      this.registral_return_form = archetype.registral_return_form;
      this.intervals = archetype.intervals;
      this.registral_motion = archetype.registral_motion
      this.intervallic_motion = archetype.intervallic_motion
    }
    else {
      this.retrospective = false;
      this.registral_return_form = NULL_REGISTRAL_RETURN_FORM;
      this.intervals = ["", ""];
      const P1 = _Interval.get("P1");
      this.registral_motion = new RegistralMotion(P1, P1)
      this.intervallic_motion = new RegistralMotion(P1, P1)
      if (prev && curr) {
        this.notes = [prev, curr]
        this.symbol = remove_minus(_Interval.distance(prev, curr));
      }
      else if (curr && next) {
        this.notes = [curr, next]
        this.symbol = remove_minus(_Interval.distance(curr, next));
      }
      else {
        if (prev) {
          this.notes = [prev];
          this.symbol = "M";
        }
        else if (curr) {
          this.notes = [curr];
          this.symbol = "M";
        }
        else if (next) {
          this.notes = [next];
          this.symbol = "M";
        }
        else {
          this.notes = [];
          this.symbol = "";
        }
      }
    }
  }
}
