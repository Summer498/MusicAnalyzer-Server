import { CollectionLayer } from "./collection-layer";
import { AudioReflectable } from "./audio-reflectable";
import { WindowReflectable } from "./window-reflectable";

export abstract class CollectionHierarchy implements AudioReflectable, WindowReflectable {
  readonly svg: SVGGElement;
  abstract readonly children: CollectionLayer[];
  protected _show: CollectionLayer[];
  get show() { return this._show; }
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this._show = [];
  }
  protected setShow(visible_layers: CollectionLayer[]) {
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
      this.children.forEach(e=> e.onWindowResized());
  }
}
