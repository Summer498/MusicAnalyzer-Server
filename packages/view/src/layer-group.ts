import { SvgCollection, TimeAndMVCController } from "./svg-collection";

export class CollectionLayer extends SvgCollection {
  readonly layer: number;
  constructor(
    children: TimeAndMVCController[],
    layer: number
  ) {
    super(children);
    this.svg.id = `layer-${layer}`;
    this.layer = layer;
  }
  onAudioUpdate(): void {
    super.onAudioUpdate();
  }
}

export abstract class CollectionLayerGroup {
  readonly svg: SVGGElement;
  protected abstract readonly children: CollectionLayer[];
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
}
