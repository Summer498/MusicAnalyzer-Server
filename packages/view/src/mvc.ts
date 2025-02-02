import { TimeAnd } from "@music-analyzer/time-and";
import { AccompanyToAudio } from "./updatable";

export interface Model extends TimeAnd { }
export interface View {
  readonly svg: SVGElement
}
export interface Controller extends AccompanyToAudio {
  readonly model: Model;
  readonly view: View
}

