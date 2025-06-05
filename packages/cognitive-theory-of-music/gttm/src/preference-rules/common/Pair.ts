import { Negatable, withNegatable } from "./create-negated";

export interface Pair<T> extends Negatable<Pair<T>> {
  readonly left: T;
  readonly right: T;
  readonly are: Pair<T>;
  different(): boolean;
}

export const createPair = <T>(left: T, right: T): Pair<T> => {
  const pair: Pair<T> = withNegatable({
    left,
    right,
    get are() { return pair; },
    different() { return pair.left !== pair.right; },
  });
  return pair;
};
