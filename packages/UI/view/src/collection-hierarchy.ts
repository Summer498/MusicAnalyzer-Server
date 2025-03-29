import { I_CollectionLayer } from "./i-collection-layer";
import { MVVM_Collection_Impl } from "./mvvm/collection-impl";
import { ICollectionHierarchy } from "./i-collection-hierarchy";

export abstract class CollectionHierarchy<L extends I_CollectionLayer>
  extends MVVM_Collection_Impl<L>
  implements ICollectionHierarchy {
  protected _show: L[];
  get show() { return this._show; }
  constructor(id: string, readonly children: L[]) {
    super(id, children);
    this._show = [];
  }
  protected setShow(visible_layers: L[]) {
    this._show = visible_layers;
    this._show.forEach(e => e.onAudioUpdate());
    this.svg.replaceChildren(...this._show.map(e => e.svg));
  }
  onChangedLayer(value: number) {
    const visible_layer = this.children.filter(e => value === e.layer);
    this.setShow(visible_layer);
  }
}
