import { ReductionElement, createReductionElement } from "./ReductionElement";
import { Chord, Head as BaseHead, createHead } from "./common";

interface IProlongationTree {
  readonly pr: IProlongationalRegion
}
interface IProlongationalRegion {
  readonly head: IHead,
  readonly primary?: IProlongationTree,
  readonly secondary?: IProlongationTree,
}
interface IHead extends BaseHead<Chord> {
  readonly recipe: "weak" | "progression" | "strong"
}
export interface IProlongationalReduction {
  readonly prtree: IProlongationTree
}

export interface Head extends IHead {}
export const createHeadPR = (head: IHead): Head => ({
  ...createHead(head),
  recipe: head.recipe,
});

export interface ProlongationTree { readonly pr: ProlongationalRegion }
export const createProlongationTree = (p_tree: IProlongationTree): ProlongationTree => ({
  pr: createProlongationalRegion(p_tree.pr),
});

export interface ProlongationalRegion extends ReductionElement, IProlongationalRegion {
  readonly head: Head;
  readonly primary?: ProlongationTree;
  readonly secondary?: ProlongationTree;
}

export const createProlongationalRegion = (pr: IProlongationalRegion): ProlongationalRegion => {
  const primary = pr.primary && createProlongationTree(pr.primary);
  const secondary = pr.secondary && createProlongationTree(pr.secondary);
  return {
    ...createReductionElement(pr.head.chord.note.id, primary?.pr, secondary?.pr),
    head: pr.head,
    primary,
    secondary,
  };
};

export interface ProlongationalReduction extends IProlongationalReduction { prtree: ProlongationTree }
export const createProlongationalReduction = (pr: IProlongationalReduction): ProlongationalReduction => ({
  prtree: createProlongationTree(pr.prtree),
});
