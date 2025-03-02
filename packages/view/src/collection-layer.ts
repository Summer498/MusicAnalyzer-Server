import { I_TimeAndVM, ReflectableTimeAndMVCControllerCollection } from "./svg-collection";

export class CollectionLayer extends ReflectableTimeAndMVCControllerCollection<I_TimeAndVM> {
  constructor(
    children: I_TimeAndVM[],
    readonly layer: number,
  ) {
    super(`layer-${layer}`, children);
  }
  onAudioUpdate(): void {
    super.onAudioUpdate();
  }
}
