import { Direction, mL, mN, mR } from "./Direction";
import { AA, AB, Magnitude } from "./Magnitude";
import { _Interval, Interval } from "../../TonalObjects";

const M3 = _Interval.get("M3");
const m3 = _Interval.get("m3");


export class ParametricScale {
  intervallic_motion_direction: Direction;
  intervallic_motion_magnitude: Magnitude;
  registral_motion_direction: Direction;
  registral_motion_magnitude: Magnitude;

  constructor(prev_interval: Interval, post_interval: Interval) {
    const prev = prev_interval.semitones;
    const post = post_interval.semitones;
    // registral
    if (Math.sign(prev) !== Math.sign(post)) {
      this.registral_motion_direction = mL;
      this.registral_motion_magnitude = AB;
    } else if (prev === 0) {
      this.registral_motion_direction = mN;
      this.registral_motion_magnitude = AB;
    } else {
      this.registral_motion_direction = mR;
      this.registral_motion_magnitude = AB;
    }

    // interval
    const C = (this.registral_motion_magnitude === AA ? M3 : m3).semitones;
    const interval = post - prev;
    this.intervallic_motion_magnitude = Math.abs(interval) > C ? AB : AA;
    this.intervallic_motion_direction = [mL, mN, mR][Math.sign(interval) + 1];
  }
}