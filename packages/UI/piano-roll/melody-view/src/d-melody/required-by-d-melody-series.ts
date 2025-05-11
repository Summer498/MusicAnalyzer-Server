import { DMelodyController } from "@music-analyzer/controllers";
import { RequiredByLayer } from "../abstract/required-by-abstract-layer";
import { RequiredByPart } from "../abstract/required-by-abstract-part";

interface RequiredByDMelody
  extends RequiredByPart { }

export interface RequiredByDMelodySeries
  extends
  RequiredByDMelody,
  RequiredByLayer {
  readonly d_melody: DMelodyController,
}
