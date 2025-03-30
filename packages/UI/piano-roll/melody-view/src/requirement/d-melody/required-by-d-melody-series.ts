import { AudioReflectableRegistry } from "@music-analyzer/view";
import { DMelodyController } from "@music-analyzer/controllers";
import { RequiredByDMelody } from "./required-by-d-melody";

export interface RequiredByDMelodySeries
  extends RequiredByDMelody {
  readonly d_melody: DMelodyController,
  readonly audio: AudioReflectableRegistry,
}
