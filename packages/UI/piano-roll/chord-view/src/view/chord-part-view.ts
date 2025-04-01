import { A_MVVM_View } from "@music-analyzer/view";

export abstract class ChordPartView
  extends A_MVVM_View {
  abstract svg: SVGElement;
  constructor() {
    super();
  }
}

