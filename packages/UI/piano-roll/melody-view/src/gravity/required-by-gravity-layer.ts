import { RequiredByGravity } from "./required-by-gravity";
import { RequiredByLayer } from "../r-layer";

export interface RequiredByGravityLayer
  extends
  RequiredByGravity,
  RequiredByLayer { }
