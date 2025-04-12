import { MVVM_View_Impl } from "@music-analyzer/view";
import { SetColor } from "@music-analyzer/controllers";

export abstract class ColorChangeable<K extends keyof SVGElementTagNameMap>
  extends MVVM_View_Impl<K>
  {
    constructor(
    tag: K
  ){
    super(tag)
  }
  readonly setColor: SetColor = getColor => this.svg.style.fill = "rgb(0, 192, 0)";
}