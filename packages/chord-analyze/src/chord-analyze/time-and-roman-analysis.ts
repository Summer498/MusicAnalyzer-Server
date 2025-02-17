import { TimeAnd } from "@music-analyzer/time-and";

export interface TimeAndRomanAnalysis extends TimeAnd {
  readonly scale: string,
  readonly chord: string,
  readonly roman: string,
}
