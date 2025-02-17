import { Chord, Head as _Head } from "../common";
import { ReductionElement } from "../ReductionElement";

interface Head extends _Head<Chord> {
  readonly recipe: "weak" | "progression" | "strong"
}

interface D_PR {
  readonly head: Head,
  readonly primary?: D_P_Tree,
  readonly secondary?: D_P_Tree,
}

class PR extends ReductionElement implements D_PR {
  override readonly head: Head;
  readonly primary?: D_P_Tree;
  readonly secondary?: D_P_Tree;
  constructor(pr: D_PR) {
    const primary = pr.primary && new P_Tree(pr.primary);
    const secondary = pr.secondary && new P_Tree(pr.secondary);
    super(pr.head.chord.note.id, primary?.pr, secondary?.pr);
    this.head = pr.head;
    this.primary = primary;
    this.secondary = secondary;
  }
}

interface D_P_Tree {
  readonly pr: D_PR
}

class P_Tree {
  readonly pr: PR;
  constructor(p_tree: D_P_Tree) {
    this.pr = new PR(p_tree.pr);
  }
}

export interface D_PRR {
  readonly prtree: D_P_Tree
}

export class PRR implements D_PRR {
  readonly prtree: P_Tree;
  constructor(pr: D_PRR){
    this.prtree = new P_Tree(pr.prtree);
  }
}