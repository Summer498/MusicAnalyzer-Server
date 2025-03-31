import { getInterval } from "./facade";
import { intervalOf } from "./facade";
import { NoteLiteral } from "./facade";
import { hsv2rgb } from "./facade";
import { rgbToString } from "./facade";
import { Triad } from "../archetype/triad/Triad";

const get_rgb_on_intervallic_angle = (
  n0: NoteLiteral,
  n1: NoteLiteral,
  n2: NoteLiteral,
) => {
  const intervals = [
    intervalOf(n0, n1),
    intervalOf(n1, n2)
  ].map(e => getInterval(e).semitones);
  const dist = (p => Math.tanh(p[0] * p[0] + p[1] * p[1]))(intervals) || 0;
  const angle = Math.atan2(intervals[1], intervals[0]) || 0;
  return hsv2rgb(angle * 360 / Math.PI, 1, dist);
};

const _get_color_on_intervallic_angle
  = (n0?: NoteLiteral, n1?: NoteLiteral, n2?: NoteLiteral) => rgbToString(
    get_rgb_on_intervallic_angle(n0 || "", n1 || "", n2 || "")
  );

export const get_color_on_intervallic_angle
  = (archetype: Triad) =>
    _get_color_on_intervallic_angle(archetype.notes[0], archetype.notes[1], archetype.notes[2]);