import { Interval } from "@music-analyzer/tonal-objects";
import { Motion } from "./Motion";
import { Direction } from "../Direction";
import { Magnitude } from "../Magnitude";

const _sgn = (x: number) => x < 0 ? -1 : x && 1
const _abs = (x: number) => x < 0 ? -x : x

export class RegistralMotion extends Motion {
  constructor(prev: Interval, curr: Interval) {
    const dir_map: ["mL", "mN", "mR"] = ["mL", "mN", "mR"];
    const mgn_map: ["AB", "AA", "AA"] = ["AB", "AA", "AA"];

    const p = _sgn(prev.semitones);
    const c = _sgn(curr.semitones);
    const d = c - p
    const sgn = d ? -1 : p && 1;
    const abs = d ? -1 : p && 1;
    super(
      new Direction(dir_map[sgn + 1], sgn),
      new Magnitude(mgn_map[abs + 1], abs)
    );
  }
}
