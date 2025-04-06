import { HierarchyLevelSubscriber } from "@music-analyzer/controllers";
import { IMelodyLayer } from "../i-layer/i-melody-layer";

export interface IMelodyHierarchy
  extends
  IMelodyLayer,
  HierarchyLevelSubscriber { }
