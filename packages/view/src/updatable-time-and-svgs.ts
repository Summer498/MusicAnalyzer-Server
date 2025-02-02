import { TimeAnd } from "@music-analyzer/time-and";
import { Updatable } from "./updatable";

export interface UpdatableTimeAndSVGs extends Updatable, TimeAnd {
  readonly svg: SVGElement;
}
