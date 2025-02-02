import { TimeAnd } from "@music-analyzer/time-and";
import { AccompanyToAudio } from "./updatable";

export interface UpdatableTimeAndSVGs extends AccompanyToAudio, TimeAnd {
  readonly svg: SVGElement;
}
