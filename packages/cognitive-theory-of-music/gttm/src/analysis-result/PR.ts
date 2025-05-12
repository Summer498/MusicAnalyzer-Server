import { ReductionElement } from "./ReductionElement";
import { Chord } from "./common";
import { Head as _Head } from "./common";
import { IHead as _IHead } from "./common";

interface IProlongationTree {
  readonly pr: IProlongationalRegion
}
interface IProlongationalRegion {
  readonly head: IHead,
  readonly primary?: IProlongationTree,
  readonly secondary?: IProlongationTree,
}
interface IHead
  extends _IHead<Chord> {
  readonly recipe: "weak" | "progression" | "strong"
}
export interface IProlongationalReduction {
  readonly prtree: IProlongationTree
}

class Head
extends _Head<Chord>
implements IHead {
  readonly recipe: "weak" | "progression" | "strong"
  constructor(head:IHead){
    super(head);
    this.recipe = head.recipe;
  }
}
class ProlongationTree {
  readonly pr: ProlongationalRegion;
  constructor(p_tree: IProlongationTree) {
    this.pr = new ProlongationalRegion(p_tree.pr);
  }
}

class ProlongationalRegion 
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

export class ProlongationalReduction 
  implements IProlongationalReduction {
  readonly prtree: ProlongationTree;
  constructor(pr: IProlongationalReduction){
    this.prtree = new ProlongationTree(pr.prtree);
  }
}