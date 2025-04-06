import { RequiredByReductionLayer } from "../r-layer/required-by-reduction-layer";
import { RequiredByHierarchy } from "./required-by-abstract-hierarchy";

export interface RequiredByReductionHierarchy
  extends
  RequiredByReductionLayer,
  RequiredByHierarchy { }
