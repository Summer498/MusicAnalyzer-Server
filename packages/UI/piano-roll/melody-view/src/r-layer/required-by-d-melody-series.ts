import { RequiredByDMelody } from "../r-part";
import { DMelodyController } from "@music-analyzer/controllers";
import { RequiredByLayer } from "./required-by-abstract-layer";

export interface RequiredByDMelodySeries
  extends
  RequiredByDMelody,
  RequiredByLayer {
  readonly d_melody: DMelodyController,
}
