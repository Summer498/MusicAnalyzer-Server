import { ExtendedMeasure } from "../measure/extended-measure";
import { HasID } from "./has-id";
import { Measure } from "../measure";

export interface Part 
  extends HasID {
  readonly measure: (Measure | ExtendedMeasure)[]
}