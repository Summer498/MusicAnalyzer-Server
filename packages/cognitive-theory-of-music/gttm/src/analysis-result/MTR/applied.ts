import { MPR } from "./metric-preference-rule";
import { Applied as BApplied } from "../common/applied";

export interface Applied 
  extends BApplied<MPR> {
  readonly level: number,
}
