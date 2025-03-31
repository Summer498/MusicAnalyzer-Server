import { AudioReflectableRegistry } from "./facade";
import { DMelodyController } from "./facade";
import { RequiredByDMelody } from "./required-by-d-melody";

export interface RequiredByDMelodySeries
  extends RequiredByDMelody {
  readonly d_melody: DMelodyController,
  readonly audio: AudioReflectableRegistry,
}
