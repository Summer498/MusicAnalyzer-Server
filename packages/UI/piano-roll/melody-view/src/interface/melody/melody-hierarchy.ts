import { HierarchyLevelSubscriber } from "@music-analyzer/controllers/src/slider/hierarchy-level/hierarchy-level-subscriber";
import { IMelodyLayer } from "./melody-layer";

export interface IMelodyHierarchy
  extends
  IMelodyLayer,
  HierarchyLevelSubscriber { }
