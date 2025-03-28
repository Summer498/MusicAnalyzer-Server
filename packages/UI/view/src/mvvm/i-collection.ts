import { I_MVVM_ModelView } from "./i-mvvm";
import { I_MVVM_View } from "./i-view";

export interface I_MVVM_Collection
  extends I_MVVM_View {
  readonly svg: SVGGElement
  readonly children: I_MVVM_ModelView[];
}
