import { IntervalOfTime } from "../common/Interval";
import { Note } from "../common/Note";

export class GPR2a<T> {
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
    // GPR2-a: (slur/rest) 
    // the interval of time from the end of n2 
    // is greater than that from the end of n1 to the beginning of n2 
    // and that from the end of n3 to the beginning of n4 or if
    
    const that = new IntervalOfTime({ from: n2.end, to: n3.begin });
    this.is_fulfilled
      = that.isGreaterThan(new IntervalOfTime({ from: n1.end, to: n2.begin }))
      && that.isGreaterThan(new IntervalOfTime({ from: n3.end, to: n4.begin }));
  }
}
