import { I_CollectionLayer } from "./collection-layer";
import { AudioReflectable } from "./audio-reflectable";
import { WindowReflectable } from "./window-reflectable";

interface I_CollectionHierarchy extends AudioReflectable, WindowReflectable {
  readonly svg: SVGGElement
  readonly children: I_CollectionLayer[]
}
export abstract class CollectionHierarchy<L extends I_CollectionLayer>
  implements I_CollectionHierarchy {
  readonly svg: SVGGElement;
  abstract readonly children: L[];
  protected _show: L[];
  get show() { return this._show; }
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
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
