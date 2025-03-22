import { IHead } from "./i-head";

export interface IProlongationTree {
  readonly pr: IProlongationalRegion
}

export interface IProlongationalRegion {
  readonly head: IHead,
  readonly primary?: IProlongationTree,
  readonly secondary?: IProlongationTree,
}

