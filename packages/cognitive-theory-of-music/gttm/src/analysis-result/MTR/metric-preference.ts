import { Part } from "../common/part";
import { Metric } from "./metric";

export type MetricalPreference = {
  readonly part: Part<"metric", Metric | Metric[]>
}
