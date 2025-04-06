import { IReductionLayer } from "../i-layer";
import { IHierarchy } from "./i-abstract-hierarchy";

export interface IReductionHierarchy
  extends
  IReductionLayer,
  IHierarchy { }