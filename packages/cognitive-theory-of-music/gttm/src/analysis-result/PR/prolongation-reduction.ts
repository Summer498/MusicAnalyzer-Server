import { IProlongationTree, ProlongationTree } from "./prolongation-tree";

export interface IProlongationalReduction {
  readonly prtree: IProlongationTree
}

export class ProlongationalReduction implements IProlongationalReduction {
  readonly prtree: ProlongationTree;
  constructor(pr: IProlongationalReduction){
    this.prtree = new ProlongationTree(pr.prtree);
  }
}