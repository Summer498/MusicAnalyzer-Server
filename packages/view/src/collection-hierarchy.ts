import { CollectionLayer, I_CollectionLayer } from "./collection-layer";
import { AudioReflectable } from "./audio-reflectable";
import { WindowReflectable } from "./window-reflectable";
import { I_TimeAndVM } from "./svg-collection";

interface I_CollectionHierarchy extends AudioReflectable, WindowReflectable {
  readonly svg: SVGGElement
  readonly children: I_CollectionLayer[]
}
export abstract class CollectionHierarchy<
  VM extends I_TimeAndVM
> implements I_CollectionHierarchy {
  readonly svg: SVGGElement;
  abstract readonly children: CollectionLayer<VM>[];
  protected _show: CollectionLayer<VM>[];
  get show() { return this._show; }
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this._show = [];
  }
  protected setShow(visible_layers: CollectionLayer<VM>[]) {
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
