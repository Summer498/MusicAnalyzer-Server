import { Note } from "../common";
import { Applied } from "./applied";

export type Metric = {
  readonly dot: number,
  readonly at: number,
  readonly applied?: Applied | Applied[]
  readonly note?: Note
}