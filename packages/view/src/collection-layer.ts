import { ReflectableTimeAndMVCControllerCollection, TimeAndMVCController } from "./svg-collection";
import { WindowReflectable } from "./window-reflectable";

export class CollectionLayer extends ReflectableTimeAndMVCControllerCollection {
  constructor(
    children: (TimeAndMVCController & WindowReflectable)[],
    readonly layer: number,
  ) {
    super(children);
    this.svg.id = `layer-${layer}`;
  }
  onAudioUpdate(): void {
    super.onAudioUpdate();
  }
}
