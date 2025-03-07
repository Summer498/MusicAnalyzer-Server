import { IProlongationalRegion, ProlongationalRegion } from "./prolongational-region";

export interface IProlongationTree {
  readonly pr: IProlongationalRegion
}

export class ProlongationTree {
  readonly pr: ProlongationalRegion;
  constructor(p_tree: IProlongationTree) {
    this.pr = new ProlongationalRegion(p_tree.pr);
  }
}
