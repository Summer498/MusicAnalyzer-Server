import { HierarchyLevelSubscriber } from "@music-analyzer/controllers"
import { I_MVVM_Collection } from "./mvvm";
import { I_MVVM_ModelView } from "./mvvm";

export interface ICollectionHierarchy
  extends
  I_MVVM_Collection,
  HierarchyLevelSubscriber {
    readonly children: I_MVVM_ModelView[];
}
