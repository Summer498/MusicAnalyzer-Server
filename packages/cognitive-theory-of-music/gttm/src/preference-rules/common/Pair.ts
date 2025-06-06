import { Negatable, withNegatable } from "./create-negated";

export interface Pair<T> {
  readonly left: T;
  readonly right: T;
  readonly are: Pair<T>;
  different(): boolean;
}

export const createPair = <T>(left: T, right: T) => {
  const pair: Pair<T> = {
    left,
    right,
    get are() { return pair; },
    different() { return pair.left !== pair.right; },
  }
  const n_pair = withNegatable(pair);
  return n_pair;
};
