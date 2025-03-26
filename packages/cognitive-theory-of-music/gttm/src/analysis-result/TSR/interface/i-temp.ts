import { Path } from "../../common";
import { Pred } from "../common";
import { Succ } from "../common";

export interface ITemp {
  readonly difference: number,
  readonly stable: 0 | "unknown" | Path,
  readonly pred: Pred
  readonly succ: Succ
}
