import { AudioReflectableRegistry } from "@music-analyzer/view/src/reflectable/audio-reflectable-registry";
import { DMelodyController } from "@music-analyzer/controllers/src/switcher/d-melody/d-melody-controller";
import { RequiredByDMelody } from "./required-by-d-melody";

export interface RequiredByDMelodySeries
  extends RequiredByDMelody {
  readonly d_melody: DMelodyController,
  readonly audio: AudioReflectableRegistry,
}
