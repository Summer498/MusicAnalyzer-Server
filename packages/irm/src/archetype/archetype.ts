import { _Interval, _Note, IntervalName, NoteLiteral } from "@music-analyzer/tonal-objects";
import { RegistralReturnForm, } from "../RegistralReturnForm";
import { ArchetypeSymbol } from "./types";
import { Triad } from "./triad/Triad";
import { Dyad } from "./Dyad";
import { Monad } from "./Monad";
import { RegistralMotion } from "../MelodyMotion/RegistralMotion";
import { IntervallicMotion } from "../MelodyMotion/IntervallicMotion";
import { Null_ad } from "./Null-ad";

const remove_minus = (src: string) => {
  if (src.length > 0) {
    return src[0] === "-" ? src.slice(1) : src;
  }
  return src;
};

export function getArchetype(): Null_ad;
export function getArchetype(note: NoteLiteral): Monad;
export function getArchetype(note1: NoteLiteral, note2: NoteLiteral): Dyad;
export function getArchetype(note1: NoteLiteral, note2: NoteLiteral, note3: NoteLiteral): Triad;
export function getArchetype(
  ...args
    : []
    | [NoteLiteral]
    | [NoteLiteral, NoteLiteral]
    | [NoteLiteral, NoteLiteral, NoteLiteral]
) {
  const e = args;
  switch (e.length) {
    case 0: return new Null_ad();
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
  readonly intervals?: [IntervalName, IntervalName];
  readonly retrospective?: boolean;
  readonly registral_return_form?: RegistralReturnForm;
  readonly registral?: RegistralMotion;
  readonly intervallic?: IntervallicMotion;

  constructor(prev?: NoteLiteral, curr?: NoteLiteral, next?: NoteLiteral) {
    if (prev && curr && next) {
      this.notes = [prev, curr, next]
      const { symbol, retrospective, archetype } = new Triad(prev, curr, next);
      this.symbol = symbol;
      this.retrospective = retrospective;
      this.registral_return_form = archetype.registral_return_form;
      this.intervals = archetype.intervals;
      this.registral = archetype.registral
      this.intervallic = archetype.intervallic
    }
    else {
      if (prev && curr) {
        this.notes = [prev, curr]
        this.symbol = "dyad";
      }
      else if (curr && next) {
        this.notes = [curr, next]
        this.symbol = "dyad";
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
