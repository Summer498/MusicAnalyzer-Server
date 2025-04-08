import { DMelodyController } from "@music-analyzer/controllers";
import { RequiredByLayer } from "../abstract/required-by-abstract-layer";
import { RequiredByDMelody } from "./required-by-d-melody";

export interface RequiredByDMelodySeries
  extends
  RequiredByDMelody,
  RequiredByLayer {
  readonly d_melody: DMelodyController,
}
