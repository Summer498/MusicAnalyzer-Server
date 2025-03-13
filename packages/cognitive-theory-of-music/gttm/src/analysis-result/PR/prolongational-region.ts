import { ReductionElement } from "../ReductionElement";
import { Head } from "./head";
import { IProlongationTree, ProlongationTree } from "./prolongation-tree";

export interface IProlongationalRegion {
  readonly head: Head,
  readonly primary?: IProlongationTree,
  readonly secondary?: IProlongationTree,
}

export class ProlongationalRegion extends ReductionElement implements IProlongationalRegion {
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
