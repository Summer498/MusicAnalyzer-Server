import { HasID } from "./has-id";
import { ExtendedMeasure } from "../measure/extended-measure";
import { Measure } from "../measure/measure";

export interface Part 
  extends HasID {
  readonly measure: (Measure | ExtendedMeasure)[]
}