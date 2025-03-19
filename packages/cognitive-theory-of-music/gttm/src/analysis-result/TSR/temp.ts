import { Path } from "../common";
import { Pred, Succ } from "./common";

export interface ITemp {
  readonly difference: number,
  readonly stable: 0 | "unknown" | Path,
  readonly pred: Pred
  readonly succ: Succ
}

export class Temp 
  implements ITemp {
  readonly difference: number;
  readonly stable: 0 | "unknown" | Path;
  readonly pred: Pred;
  readonly succ: Succ;
  constructor(temp: ITemp) {
    this.difference = temp.difference;
    this.stable = temp.stable;
    this.pred = temp.pred;
    this.succ = temp.succ;
  }
}
