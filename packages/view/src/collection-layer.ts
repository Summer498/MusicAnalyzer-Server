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
