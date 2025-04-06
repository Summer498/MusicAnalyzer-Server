import { RequiredByReduction } from "../r-part";
import { RequiredByLayer } from "./required-by-abstract-layer";

export interface RequiredByReductionLayer
  extends
  RequiredByReduction,
  RequiredByLayer { }
