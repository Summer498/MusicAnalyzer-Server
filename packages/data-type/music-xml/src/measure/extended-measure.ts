import { Barline } from "./barline"
import { Measure } from "./measure"
import { Attribute } from "../attribute"
import { Print } from "../print"

export interface ExtendedMeasure 
  extends Measure {
  readonly print: Print
  readonly attributes: Attribute
  readonly barline: Barline
}
