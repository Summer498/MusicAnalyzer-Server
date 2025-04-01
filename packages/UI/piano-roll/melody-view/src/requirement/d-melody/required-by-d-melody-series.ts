import { AudioReflectableRegistry } from "@music-analyzer/view";
import { RequiredByDMelody } from "./required-by-d-melody";
import { DMelodyController } from "@music-analyzer/controllers";

export interface RequiredByDMelodySeries
  extends RequiredByDMelody {
  readonly d_melody: DMelodyController,
  readonly audio: AudioReflectableRegistry,
}
