import { GravitySwitcherSubscriber } from "@music-analyzer/controllers";
import { IGravityLayer } from "../i-layer/i-gravity-layer";

export interface IGravityHierarchy
  extends
  IGravityLayer,
  GravitySwitcherSubscriber { }