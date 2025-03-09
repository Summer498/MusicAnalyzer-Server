import { _Interval, _Note, IntervalName, NoteLiteral } from "@music-analyzer/tonal-objects";
import { MelodyMotion, no_motion } from "../MelodyMotion/MelodyMotion";
import { NULL_REGISTRAL_RETURN_FORM, RegistralReturnForm, } from "../RegistralReturnForm";
import { _ArchetypeSymbol, ArchetypeSymbol } from "./types";
import { Archetype3 } from "./archetype3";

const remove_minus = (src: string) => {
  if (src.length > 0) {
    return src[0] === "-" ? src.slice(1) : src;
  }
  return src;
};

export class Archetype {
  readonly _symbol: _ArchetypeSymbol;
  readonly symbol: ArchetypeSymbol;
  readonly retrospective: boolean;
  readonly registral_return_form: RegistralReturnForm;
  readonly notes: NoteLiteral[];
  readonly intervals: IntervalName[];
  readonly melody_motion: MelodyMotion;

  constructor(prev?: NoteLiteral, curr?: NoteLiteral, next?: NoteLiteral) {
    this.notes = [prev, curr, next].map(e => e || "");
    if (prev && curr && next) {
      const e = new Archetype3(prev, curr, next);
      this._symbol = e._symbol;
      this.symbol = e.symbol;
      this.retrospective = e.retrospective;
      this.registral_return_form = e.registral_return_form;
      this.intervals = e.intervals;
      this.melody_motion = e.melody_motion;
    }
    else {
      this.retrospective = false;
      this.registral_return_form = NULL_REGISTRAL_RETURN_FORM;
      this.intervals = ["", ""];
      this.melody_motion = no_motion;
      if (prev && curr) {
        this._symbol = "dyad";
        this.symbol = remove_minus(_Interval.distance(prev, curr));
      }
      else if (curr && next) {
        this._symbol = "dyad";
        this.symbol = remove_minus(_Interval.distance(curr, next));
      }
      else if (prev || curr || next) {
        this._symbol = "M";
        this.symbol = "M";
      }
      else {
        this._symbol = "";
        this.symbol = "";
      }
    }
  }
}
