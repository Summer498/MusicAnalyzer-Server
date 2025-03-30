import { GravitySwitcherSubscriber } from "@music-analyzer/controllers";
import { IGravityLayer } from "./gravity-layer";

export interface IGravityHierarchy
  extends
  IGravityLayer,
  GravitySwitcherSubscriber { }