import { AudioReflectableRegistry } from "@music-analyzer/view";
import { RequiredByHierarchy, RequiredByPart, RequiredByView } from "../abstract/required-by-abstract-hierarchy";
import { MelodyBeepController } from "@music-analyzer/controllers";

export interface RequiredByMelodyView
  extends RequiredByView { }

export interface RequiredByMelodyBeep {
  readonly melody_beep: MelodyBeepController
}

export interface RequiredByMelody
  extends
  RequiredByMelodyBeep,
  RequiredByMelodyView,
  RequiredByPart { }
export interface RequiredByMelodyLayer
  extends RequiredByMelody { }

export interface RequiredByMelodyHierarchy
  extends
  RequiredByMelodyLayer,
  RequiredByHierarchy {
  readonly audio: AudioReflectableRegistry
}
