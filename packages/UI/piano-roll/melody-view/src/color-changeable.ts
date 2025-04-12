import { MVVM_View_Impl } from "@music-analyzer/view";

export abstract class ColorChangeable<K extends keyof SVGElementTagNameMap>
  extends MVVM_View_Impl<K>
  {
    constructor(
    tag: K
  ){
    super(tag)
  }
  readonly setColor = (color:string) => this.svg.style.fill = color;
}