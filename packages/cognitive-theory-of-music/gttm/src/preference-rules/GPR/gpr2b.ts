import type { IntervalOfTime, Note } from "../common";
import { createIntervalOfTime } from "../common";

export interface GPR2b<T> { readonly is_fulfilled: boolean }
export const createGPR2b = <T>(
  n1: Note<T>,
  n2: Note<T>,
  n3: Note<T>,
  n4: Note<T>,
) : GPR2b<T> => {
  // GPR2: (Proximity)
  // Consider a sequence of four notes, n1–n4,
  // the transition n2–n3 may be heard as a group boundary if:
  // GPR2-b: (attack/point)
  // the interval of time between the attack points of n2 and n3
  // is greater than between those of n1 and n2
  // and between those of n3 and n4.

  const that = createIntervalOfTime({ from: n2.attack_point, to: n3.attack_point });
  const is_fulfilled
    = that.isGreaterThan(createIntervalOfTime({ from: n1.attack_point, to: n2.attack_point }))
    && that.isGreaterThan(createIntervalOfTime({ from: n3.attack_point, to: n4.attack_point }));
  return { is_fulfilled };
};
