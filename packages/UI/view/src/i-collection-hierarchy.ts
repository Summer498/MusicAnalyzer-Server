import { I_MVVM_Collection } from "./mvvm";
import { I_MVVM_ModelView } from "./mvvm";

export interface ICollectionHierarchy
  extends
  I_MVVM_Collection
{
    readonly children: I_MVVM_ModelView[];
}
