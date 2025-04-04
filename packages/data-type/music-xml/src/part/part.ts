import { HasID } from "./has-id";
import { ExtendedMeasure } from "../measure";
import { Measure } from "../measure";

export interface Part 
  extends HasID {
  readonly measure: (Measure | ExtendedMeasure)[]
}