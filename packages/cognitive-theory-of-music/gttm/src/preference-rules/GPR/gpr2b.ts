import { IntervalOfTime, Note } from "../common";

export class GPR2b<T> {
  readonly is_fulfilled: boolean;
  constructor(
    n1: Note<T>,
    n2: Note<T>,
    n3: Note<T>,
    n4: Note<T>,
  ) {
    // GPR2: (Proximity) 
    // Consider a sequence of four notes, n1–n4, 
    // the transition n2–n3 may be heard as a group boundary if:
    // GPR2-b: (attack/point) 
    // the interval of time between the attack points of n2 and n3 
    // is greater than between those of n1 and n2 
    // and between those of n3 and n4.

    const that = new IntervalOfTime({ from: n2.attack_point, to: n3.attack_point });
    this.is_fulfilled
      = that.isGreaterThan(new IntervalOfTime({ from: n1.attack_point, to: n2.attack_point }))
      && that.isGreaterThan(new IntervalOfTime({ from: n3.attack_point, to: n4.attack_point }));
  }
}