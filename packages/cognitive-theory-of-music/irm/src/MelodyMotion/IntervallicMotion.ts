import { _Interval, Interval } from "@music-analyzer/tonal-objects";
import { Motion } from "./Motion";
import { Direction } from "../Direction";
import { Magnitude } from "../Magnitude";

const M3 = _Interval.get("M3");
const m3 = _Interval.get("m3");

const _sgn = (x: number) => x < 0 ? -1 : x && 1
const _abs = (x: number) => x < 0 ? -x : x

export class IntervallicMotion 
  extends Motion {
  constructor(prev: Interval, curr: Interval) {
    const dir_map: ["mL", "mN", "mR"] = ["mL", "mN", "mR"];

    // registral
    const pd = _sgn(prev.semitones);
    const cd = _sgn(curr.semitones);

    // interval
    const C = (cd - pd ? m3 : M3).semitones;
    const p = _abs(prev.semitones);
    const c = _abs(curr.semitones);
    const d = c - p;
    const sgn = d < 0 ? -1 : d && 1;
    const abs = d < 0 ? -d : d;
    super(
      new Direction(dir_map[sgn + 1], sgn),
      new Magnitude(abs < C ? "AA" : "AB", abs)
    );
  }
}
