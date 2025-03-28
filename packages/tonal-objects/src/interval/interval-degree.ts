import { castToNumber } from "@music-analyzer/stdlib/src/string/cast-to-number";
import { NoteLiteral } from "@tonaljs/pitch-note";
import { default as _Interval } from "@tonaljs/interval";

export const getIntervalDegree = (src: NoteLiteral, dst: NoteLiteral) => castToNumber(_Interval.distance(src, dst).slice(0, 1));
