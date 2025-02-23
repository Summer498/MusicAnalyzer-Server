import { ReflectableTimeAndMVCControllerCollection, TimeAndMVCController } from "./svg-collection";
import { WindowReflectable } from "./window-reflectable";

export class CollectionLayer extends ReflectableTimeAndMVCControllerCollection {
  readonly layer: number;
  constructor(
    children: (TimeAndMVCController & WindowReflectable)[],
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
