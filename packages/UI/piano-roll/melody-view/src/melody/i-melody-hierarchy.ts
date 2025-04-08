import { IHierarchy } from "../abstract/i-abstract-hierarchy";
import { IMelodyLayer } from "./i-melody-layer";

export interface IMelodyHierarchy
  extends
  IMelodyLayer,
  IHierarchy { }
