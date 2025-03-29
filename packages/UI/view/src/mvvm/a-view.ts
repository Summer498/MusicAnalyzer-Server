import { I_MVVM_View } from "./i-view";

export abstract class A_MVVM_View
implements I_MVVM_View {
  abstract readonly svg: SVGElement
}
