import { Negatable } from "./create-negated";

export class Pair<T> extends Negatable {
  readonly left: T;
  readonly right: T;
  get are() { return this; }
  constructor(left: T, right: T) {
    super();
    this.left = left;
    this.right = right;
  }
  different() {
    return this.left !== this.right;
  }
}