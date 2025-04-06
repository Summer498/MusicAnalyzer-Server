import { MVVM_View_Impl } from "@music-analyzer/view";

export abstract class View<K extends keyof SVGElementTagNameMap>
  extends MVVM_View_Impl<K> {
  constructor(
    tag: K
  ){
    super(tag)
  }
}