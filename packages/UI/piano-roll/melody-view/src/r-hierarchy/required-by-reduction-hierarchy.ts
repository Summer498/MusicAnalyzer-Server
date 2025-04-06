import { RequiredByReductionLayer } from "../r-layer";
import { RequiredByHierarchy } from "./required-by-abstract-hierarchy";

export interface RequiredByReductionHierarchy
  extends
  RequiredByReductionLayer,
  RequiredByHierarchy { }
