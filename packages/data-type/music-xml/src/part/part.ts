import { HasID } from "./has-id";
import { ExtendedMeasure, Measure } from "../measure";

export interface Part 
  extends HasID {
  readonly measure: (Measure | ExtendedMeasure)[]
}