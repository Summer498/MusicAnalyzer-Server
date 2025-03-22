import { IHead } from "../../common";
import { IAt } from "./i-at";
import { IChord } from "./i-chord";

export interface ITimeSpanTree {
  readonly ts: ITimeSpan
}

export interface ITimeSpan {
  readonly timespan: number,
  readonly leftend: number,
  readonly rightend: number,
  readonly head: IHead<IChord>,
  readonly at: IAt,
  readonly primary?: ITimeSpanTree
  readonly secondary?: ITimeSpanTree
}
