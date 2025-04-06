import { I_MVVM_View } from "./i-view";

export abstract class MVVM_View_Impl<
  K extends keyof SVGElementTagNameMap
> implements I_MVVM_View {
  readonly svg: SVGElementTagNameMap[K];
  constructor(
    svg_tagname: K
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", svg_tagname);
  }
}
