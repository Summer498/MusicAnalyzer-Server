import { TimeAnd } from "@music-analyzer/time-and";
import { Updatable } from "./updatable";

export interface Model extends TimeAnd { }
export interface View {
  readonly svg: SVGElement
}
export interface Controller extends Updatable {
  readonly model: Model;
  readonly view: View
}

