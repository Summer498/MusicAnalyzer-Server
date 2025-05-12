import { Part } from "./common";
import { Note } from "./common";
import { Applied as BApplied } from "./common";
type MPR = "3" | "4" | "5a" | "5b" | "5c" | "5d" | "5e"

interface Applied 
  extends BApplied<MPR> {
  readonly level: number,
}

type Metric = {
  readonly dot: number,
  readonly at: number,
  readonly applied?: Applied | Applied[]
  readonly note?: Note
}
type MetricalPreference = {
  readonly part: Part<"metric", Metric | Metric[]>
}

export type MetricalStructure = {
  readonly MPR: MetricalPreference
}