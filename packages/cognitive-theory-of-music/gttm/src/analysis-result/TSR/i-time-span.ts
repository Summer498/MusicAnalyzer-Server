import { Head } from "../common";
import { At } from "./at";
import { IChord } from "./Chord";

export interface ITimeSpanTree {
  readonly ts: ITimeSpan
}

export interface ITimeSpan {
  readonly timespan: number,
  readonly leftend: number,
  readonly rightend: number,
  readonly head: Head<IChord>,
  readonly at: At,
  readonly primary?: ITimeSpanTree
  readonly secondary?: ITimeSpanTree
}
