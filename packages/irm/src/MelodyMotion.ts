import { _Interval } from "@music-analyzer/tonal-objects";
import { Interval } from "@music-analyzer/tonal-objects";
import { Direction, DirectionName } from "./Direction";
import { Magnitude, MagnitudeName } from "./Magnitude";

const M3 = _Interval.get("M3");
const m3 = _Interval.get("m3");

class Motion {
  readonly direction;
  readonly magnitude;
  readonly closure: 0 | 1;
  constructor(dir: Direction, mgn: Magnitude) {
    this.direction = dir;
    this.magnitude = mgn;
    this.closure = dir.name === "mL" && mgn.name === "AB" ? 1 : 0;
  }
}

export class MelodyMotion {
  readonly registral: Motion;
  readonly intervallic: Motion;

  constructor(prev_interval: Interval, post_interval: Interval) {
    const prev = prev_interval.semitones;
    const next = post_interval.semitones;
    const dir_map: DirectionName[] = ["mL", "mN", "mR"];
    const mgn_map: MagnitudeName[] = ["AA", "AA", "AB"];

    // registral
    const p_dir = Math.sign(prev);
    const c_dir = Math.sign(next);
    const v_sgn = p_dir !== c_dir ? -1 : prev === 0 ? 0 : 1;
    const v_abs = p_dir !== c_dir ? 2 : prev === 0 ? 0 : 1;
    this.registral = new Motion(
      new Direction(dir_map[v_sgn + 1], v_sgn),
      new Magnitude(mgn_map[v_abs], v_abs)
    );

    // interval
    const C = (p_dir === c_dir ? M3 : m3).semitones;
    const intervallic = Math.abs(next) - Math.abs(prev);
    const i_sgn = Math.sign(intervallic);
    const i_abs = Math.abs(intervallic);
    this.intervallic =
      new Motion(
        new Direction(dir_map[i_sgn + 1], i_sgn),
        new Magnitude(i_abs < C ? "AA" : "AB", i_abs)
      );
  }
}

export const no_motion = new MelodyMotion(_Interval.get("P1"), _Interval.get("P1"));