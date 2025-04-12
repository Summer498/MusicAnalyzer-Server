import { IHierarchy } from "../abstract/i-abstract-hierarchy";
import { IGravityLayer } from "./i-gravity-layer";

export interface IGravityHierarchy
  extends
  IGravityLayer,
  IHierarchy
  {}