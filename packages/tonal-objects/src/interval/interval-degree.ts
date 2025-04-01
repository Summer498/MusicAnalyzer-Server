import { NoteLiteral } from "@tonaljs/pitch-note";
import { default as _Interval } from "@tonaljs/interval";
import { castToNumber } from "@music-analyzer/stdlib";

export const getIntervalDegree = (src: NoteLiteral, dst: NoteLiteral) => castToNumber(_Interval.distance(src, dst).slice(0, 1));
