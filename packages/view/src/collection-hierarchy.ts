import { CollectionLayer } from "./collection-layer";
import { AccompanyToAudioRegistry } from "./updatable-registry";

export abstract class CollectionHierarchy {
  readonly svg: SVGGElement;
  protected abstract readonly children: CollectionLayer[];
  protected _show: CollectionLayer[];
  get show() { return this._show; }
  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this._show = [];
    AccompanyToAudioRegistry.instance.register(this);
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
    this.show.forEach(e => e.onAudioUpdate());
  }
}
