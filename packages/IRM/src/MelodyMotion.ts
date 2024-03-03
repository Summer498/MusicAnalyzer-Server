import { _Interval } from "../../TonalObjects";
import { Interval } from "../../TonalObjects";
import { Direction, mL, mN, mR } from "./Direction";
import { AA, AB, Magnitude } from "./Magnitude";
import { bool2number } from "../../Math";

const M3 = _Interval.get("M3");
const m3 = _Interval.get("m3");

export class MelodyMotion {
  registral_motion_direction: Direction;
  registral_motion_magnitude: Magnitude;
  registral_motion_closure: 0 | 1;
  intervallic_motion_direction: Direction;
  intervallic_motion_magnitude: Magnitude;
  intervallic_motion_closure: 0 | 1;

  constructor(prev_interval: Interval, post_interval: Interval) {
    const prev = prev_interval.semitones;
    const curr = post_interval.semitones;
    // registral
    const p_dir = Math.sign(prev);
    const c_dir = Math.sign(curr);
    this.registral_motion_magnitude = p_dir === c_dir ? AA : AB;
    this.registral_motion_closure = p_dir === c_dir ? 0 : 1;
    if (p_dir !== c_dir) { this.registral_motion_direction = mL; }
    else if (prev === 0) { this.registral_motion_direction = mN; }
    else { this.registral_motion_direction = mR; }

    // interval
    const C = (this.registral_motion_magnitude === AA ? M3 : m3).semitones;
    const intervallic_motion = Math.abs(curr) - Math.abs(prev);
    this.intervallic_motion_direction = [mL, mN, mR][Math.sign(intervallic_motion) + 1];
    this.intervallic_motion_magnitude = Math.abs(intervallic_motion) > C ? AB : AA;
    this.intervallic_motion_closure = bool2number(
      this.intervallic_motion_direction === mL
      && this.intervallic_motion_magnitude === AB
    );
  }
}

export const no_motion = new MelodyMotion(_Interval.get("P1"), _Interval.get("P1"));