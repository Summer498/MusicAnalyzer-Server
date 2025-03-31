import { GravitySwitcherSubscriber } from "./facade";
import { IGravityLayer } from "./gravity-layer";

export interface IGravityHierarchy
  extends
  IGravityLayer,
  GravitySwitcherSubscriber { }