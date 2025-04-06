import { RequiredByReduction } from "../r-part/required-by-reduction";
import { RequiredByLayer } from "./required-by-abstract-layer";

export interface RequiredByReductionLayer
  extends
  RequiredByReduction,
  RequiredByLayer { }
