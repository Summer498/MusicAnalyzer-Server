import { MVVM_Model } from "./model";

export abstract class MVVM_View<
  K extends keyof SVGElementTagNameMap,
  M extends MVVM_Model,
> {
  readonly svg: SVGElementTagNameMap[K];
  constructor(
    svg_tagname: K,
    protected readonly model: M,
  ) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", svg_tagname);
  }
}
