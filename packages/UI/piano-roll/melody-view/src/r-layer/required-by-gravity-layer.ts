import { RequiredByGravity } from "../r-part/required-by-gravity";
import { RequiredByLayer } from "./required-by-abstract-layer";

export interface RequiredByGravityLayer
  extends
  RequiredByGravity,
  RequiredByLayer { }
