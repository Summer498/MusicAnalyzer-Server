import { _Interval } from "@music-analyzer/tonal-objects";
import { Interval } from "@music-analyzer/tonal-objects";
import { RegistralMotion } from "./RegistralMotion";
import { IntervallicMotion } from "./IntervallicMotion";

export class MelodyMotion {
  readonly registral: RegistralMotion;
  readonly intervallic: IntervallicMotion;

  constructor(prev_interval: Interval, post_interval: Interval) {
    this.registral = new RegistralMotion(prev_interval, post_interval)
    this.intervallic = new IntervallicMotion(prev_interval, post_interval)
  }
}

export const no_motion = new MelodyMotion(_Interval.get("P1"), _Interval.get("P1"));