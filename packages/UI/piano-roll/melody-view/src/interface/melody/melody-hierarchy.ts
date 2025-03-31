import { HierarchyLevelSubscriber } from "./facade";
import { IMelodyLayer } from "./melody-layer";

export interface IMelodyHierarchy
  extends
  IMelodyLayer,
  HierarchyLevelSubscriber { }
