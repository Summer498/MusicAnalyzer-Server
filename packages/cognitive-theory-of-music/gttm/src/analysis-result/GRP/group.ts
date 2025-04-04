import { Note } from "../common";
import { Applied } from "../common";
import { GPR } from "./grouping-preference-rule";

export type Group = {
  readonly group?: Group | Group[]
  readonly note?: Note | Note[]
  readonly applied?: Applied<GPR> | Applied<GPR>[]
}
