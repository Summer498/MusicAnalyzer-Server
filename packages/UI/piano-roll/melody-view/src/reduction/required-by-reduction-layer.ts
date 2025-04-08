import { RequiredByLayer } from "../abstract/required-by-abstract-layer";
import { RequiredByReduction } from "./required-by-reduction";

export interface RequiredByReductionLayer
  extends
  RequiredByReduction,
  RequiredByLayer { }
