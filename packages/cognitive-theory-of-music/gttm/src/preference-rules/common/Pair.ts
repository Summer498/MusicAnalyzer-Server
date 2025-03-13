import { Negatable } from "./create-negated";

export class Pair<T> extends Negatable {
  get are() { return this; }
  constructor(
    readonly left: T,
    readonly right: T
  ) {
    super();
  }
  different() {
    return this.left !== this.right;
  }
}