import { RequiredByLayer } from "../abstract/required-by-abstract-layer";
import { RequiredByGravity } from "./required-by-gravity";

export interface RequiredByGravityLayer
  extends
  RequiredByGravity,
  RequiredByLayer { }
