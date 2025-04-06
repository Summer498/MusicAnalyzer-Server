import { RequiredByGravity } from "../r-part";
import { RequiredByLayer } from "./required-by-abstract-layer";

export interface RequiredByGravityLayer
  extends
  RequiredByGravity,
  RequiredByLayer { }
