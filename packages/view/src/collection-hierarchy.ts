import { AudioReflectable } from "@music-analyzer/music-analyzer-application";
import { I_CollectionLayer } from "./collection-layer";
import { I_MVVM_Collection, MVVM_Collection } from "./mvc";

export abstract class CollectionHierarchy<L extends I_CollectionLayer>
  extends MVVM_Collection<L>
  implements I_MVVM_Collection, AudioReflectable {
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
    const visible_layer = this.children.filter(
      layer => value === layer.layer
    );
    this.setShow(visible_layer);
  }
  onAudioUpdate() {
    this.children.forEach(e => e.onAudioUpdate());
  }
  onWindowResized() {
    this.children.forEach(e => e.onWindowResized());
  }
}
