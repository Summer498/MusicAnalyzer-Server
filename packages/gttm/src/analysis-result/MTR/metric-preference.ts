import { Part } from "../common";
import { Metric } from "./metric";

export type MetricalPreference = {
  readonly part: Part<"metric", Metric | Metric[]>
}
