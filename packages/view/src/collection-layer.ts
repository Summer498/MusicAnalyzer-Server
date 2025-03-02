import { I_TimeAndVM, ReflectableTimeAndMVCControllerCollection } from "./svg-collection";
import { WindowReflectable } from "./window-reflectable";

export class CollectionLayer extends ReflectableTimeAndMVCControllerCollection {
  constructor(
    children: (I_TimeAndVM & WindowReflectable)[],
    readonly layer: number,
  ) {
    super(children);
    this.svg.id = `layer-${layer}`;
  }
  onAudioUpdate(): void {
    super.onAudioUpdate();
  }
}
