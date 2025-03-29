import { I_MVVM_ModelView } from "./i-mvvm";

export abstract class A_MVVM_ModelView
  implements I_MVVM_ModelView {
    abstract readonly svg: SVGElement;
  }