import { I_MVVM_Collection } from "./i-collection";
import { I_MVVM_ModelView } from "./i-mvvm";

export abstract class A_MVVM_Collection
  implements I_MVVM_Collection {
  abstract readonly svg: SVGGElement
  abstract readonly children: I_MVVM_ModelView[];
}
