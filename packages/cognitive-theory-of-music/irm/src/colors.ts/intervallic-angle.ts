import { _Interval, NoteLiteral } from "@music-analyzer/tonal-objects";
import { hsv2rgb, rgbToString } from "@music-analyzer/color";
import { Dyad, Monad, Null_ad, Triad } from "../archetype";

const get_rgb_on_intervallic_angle = (
  n0: NoteLiteral,
  n1: NoteLiteral,
  n2: NoteLiteral,
) => {
  const intervals = [
    _Interval.distance(n0, n1),
    _Interval.distance(n1, n2)
  ].map(e => _Interval.get(e).semitones);
  const dist = (p => Math.tanh(p[0] * p[0] + p[1] * p[1]))(intervals) || 0;
  const angle = Math.atan2(intervals[1], intervals[0]) || 0;
  return hsv2rgb(angle * 360 / Math.PI, 1, dist);
};

const _get_color_on_intervallic_angle
  = (n0?: NoteLiteral, n1?: NoteLiteral, n2?: NoteLiteral) => rgbToString(
    get_rgb_on_intervallic_angle(n0 || "", n1 || "", n2 || "")
  );

export const get_color_on_intervallic_angle
  = (archetype: Triad | Dyad | Monad | Null_ad) =>
    _get_color_on_intervallic_angle(archetype.notes[0], archetype.notes[1], archetype.notes[2]);