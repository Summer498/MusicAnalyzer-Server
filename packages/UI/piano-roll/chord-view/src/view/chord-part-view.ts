import { A_MVVM_View } from "./facade";

export abstract class ChordPartView
  extends A_MVVM_View {
  abstract svg: SVGElement;
  constructor() {
    super();
  }
}

