import { MVVM_View_Impl } from "@music-analyzer/view";
import { ColorChangeSubscriber } from "@music-analyzer/controllers";
import { SetColor } from "@music-analyzer/controllers";

export abstract class ColorChangeable<K extends keyof SVGElementTagNameMap>
  extends MVVM_View_Impl<K>
  implements ColorChangeSubscriber {
    constructor(
    tag: K
  ){
    super(tag)
  }
  readonly setColor: SetColor = getColor => this.svg.style.fill = "rgb(0, 192, 0)";
}