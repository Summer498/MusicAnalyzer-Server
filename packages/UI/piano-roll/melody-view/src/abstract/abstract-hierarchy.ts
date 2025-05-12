import { CollectionHierarchy } from "@music-analyzer/view";
import { I_Layer } from "./i-layer";
import { CollectionLayer, I_TimeAndVM } from "@music-analyzer/view";
import { I_MVVM_View, MVVM_ViewModel_Impl } from "@music-analyzer/view"
import { MVVM_View_Impl } from "@music-analyzer/view";
import { Time } from "@music-analyzer/time-and";

export abstract class Model {
  constructor(
    readonly time: Time,
    readonly head: Time,
  ) { }
}
export abstract class View<K extends keyof SVGElementTagNameMap>
  extends MVVM_View_Impl<K> {
  constructor(
    tag: K
  ) {
    super(tag)
  }
}
export abstract class Part<M extends {}, V extends I_MVVM_View>
  extends MVVM_ViewModel_Impl<M, V> {
  constructor(
    model: M,
    view: V,
  ) {
    super(model, view)
  }
}

export abstract class Layer<P extends I_TimeAndVM>
  extends CollectionLayer<P>
  implements I_Layer {
  constructor(
    layer: number,
    children: P[],
  ) {
    super(layer, children);
  }
  abstract onWindowResized(): void
}
export abstract class Hierarchy<L extends I_Layer>
  extends CollectionHierarchy<L> {
  constructor(
    id: string,
    children: L[]
  ) {
    super(id, children)
  }
  onAudioUpdate() { this.children.forEach(e => e.onAudioUpdate()); }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()); }
}