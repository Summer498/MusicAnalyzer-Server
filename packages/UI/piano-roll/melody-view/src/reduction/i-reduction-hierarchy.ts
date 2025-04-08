import { IHierarchy } from "../abstract/i-abstract-hierarchy";
import { IReductionLayer } from "./i-reduction-layer";

export interface IReductionHierarchy
  extends
  IReductionLayer,
  IHierarchy { }
