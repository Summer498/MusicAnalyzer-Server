import { Attribute } from "../attribute/attribute"
import { Barline } from "./barline"
import { Measure } from "./measure"
import { Print } from "../print/print"

export interface ExtendedMeasure 
  extends Measure {
  readonly print: Print
  readonly attributes: Attribute
  readonly barline: Barline
}
