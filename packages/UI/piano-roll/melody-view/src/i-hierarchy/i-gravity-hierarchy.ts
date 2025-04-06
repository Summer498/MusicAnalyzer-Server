import { GravitySwitcherSubscriber } from "@music-analyzer/controllers";
import { IGravityLayer } from "../i-layer";
import { IHierarchy } from "./i-abstract-hierarchy";

export interface IGravityHierarchy
  extends
  IGravityLayer,
  IHierarchy,
  GravitySwitcherSubscriber { }
