import { ReductionElement } from "../../ReductionElement";
import { Head } from "./head";
import { IProlongationalRegion } from "../interface/i-prolongation-tree";
import { IProlongationTree } from "../interface/i-prolongation-tree";

export class ProlongationTree {
  readonly pr: ProlongationalRegion;
  constructor(p_tree: IProlongationTree) {
    this.pr = new ProlongationalRegion(p_tree.pr);
  }
}

export class ProlongationalRegion 
  extends ReductionElement 
  implements IProlongationalRegion {
  override readonly head: Head;
  readonly primary?: IProlongationTree;
  readonly secondary?: IProlongationTree;
  constructor(pr: IProlongationalRegion) {
    const primary = pr.primary && new ProlongationTree(pr.primary);
    const secondary = pr.secondary && new ProlongationTree(pr.secondary);
    super(pr.head.chord.note.id, primary?.pr, secondary?.pr);
    this.head = pr.head;
    this.primary = primary;
    this.secondary = secondary;
  }
}
