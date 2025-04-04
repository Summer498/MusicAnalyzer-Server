import { IProlongationalReduction } from "../interface";
import { ProlongationTree } from "./prolongational-tree";

export class ProlongationalReduction 
  implements IProlongationalReduction {
  readonly prtree: ProlongationTree;
  constructor(pr: IProlongationalReduction){
    this.prtree = new ProlongationTree(pr.prtree);
  }
}