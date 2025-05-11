import { DMelodyController } from "@music-analyzer/controllers";
import { RequiredByLayer, RequiredByPart } from "../abstract/required-by-abstract-hierarchy";

interface RequiredByDMelody
  extends RequiredByPart { }

export interface RequiredByDMelodySeries
  extends
  RequiredByDMelody,
  RequiredByLayer {
  readonly d_melody: DMelodyController,
}
