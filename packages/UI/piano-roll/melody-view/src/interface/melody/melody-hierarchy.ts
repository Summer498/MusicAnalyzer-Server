import { HierarchyLevelSubscriber } from "@music-analyzer/controllers";
import { IMelodyLayer } from "./melody-layer";

export interface IMelodyHierarchy
  extends
  IMelodyLayer,
  HierarchyLevelSubscriber { }
