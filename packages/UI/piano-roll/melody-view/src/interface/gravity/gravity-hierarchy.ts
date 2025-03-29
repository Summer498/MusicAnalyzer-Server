import { GravitySwitcherSubscriber } from "@music-analyzer/controllers/src/switcher/gravity/gravity-switcher-subscriber";
import { IGravityLayer } from "./gravity-layer";

export interface IGravityHierarchy
  extends
  IGravityLayer,
  GravitySwitcherSubscriber { }