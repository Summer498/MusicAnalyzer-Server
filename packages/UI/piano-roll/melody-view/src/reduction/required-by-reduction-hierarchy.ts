import { RequiredByHierarchy } from "../abstract/required-by-abstract-hierarchy";
import { RequiredByReductionLayer } from "./required-by-reduction-layer";

export interface RequiredByReductionHierarchy
  extends
  RequiredByReductionLayer,
  RequiredByHierarchy { }
