import { _Interval } from "@music-analyzer/tonal-objects";
import { Archetype } from "./MelodicArchetype";
import { hsv2rgb, rgbToString } from "@music-analyzer/color";

const get_rgb_of_Narmour_concept = (archetype: Archetype): number[] => {
  switch (archetype._symbol) {
    case "VP": case "(VP)": return [0x00, 0xaa, 0xff];
    case "P": case "(P)": return [0x00, 0x00, 0xff];
    case "IP": case "(IP)": return [0xaa, 0x00, 0xff];
    case "VR": case "(VR)": return [0xff, 0x00, 0xaa];
    case "R": case "(R)": return [0xff, 0x00, 0x00];
    case "IR": case "(IR)": return [0xff, 0xaa, 0x00];
    case "D": case "(D)": return [0x00, 0xe0, 0x00];
    case "ID": case "(ID)": return [0x00, 0xff, 0xaa];
    case "M":
    case "dyad": return [0x40, 0x40, 0x40];
    default: return [0x00, 0x00, 0x00];
  }
};

const get_grb_on_parametric_scale = (archetype: Archetype) => {
  const s = archetype.melody_motion.intervallic.direction.name === "mL" ? -1 : 0;
  const v = archetype.melody_motion.intervallic.direction.name === "mR" ? -1 : 0;
  const scale = archetype.melody_motion.intervallic.magnitude.name === "AA" ? 0.25 : 0.5;
  const B = 60;
  switch (archetype.melody_motion.registral.direction.name) {
    case "mL": return hsv2rgb(60 + B, 1 + s * scale, 1 + v * scale);
    case "mN": return hsv2rgb(0 + B, 1 + s * scale, 1 + v * scale);
    case "mR": return hsv2rgb(-60 + B, 1 + s * scale, 1 + v * scale);
  }
};

const get_rgb_on_intervallic_angle = (notes: string[]) => {
  const intervals = [
    _Interval.distance(notes[0], notes[1]),
    _Interval.distance(notes[1], notes[2])
  ].map(e => _Interval.get(e).semitones);
  const dist = (p => Math.tanh(p[0] * p[0] + p[1] * p[1]))(intervals);
  const angle = Math.atan2(intervals[1], intervals[0]);
  return hsv2rgb(angle * 360 / Math.PI, 1, dist);
};

export const get_color_of_Narmour_concept = (archetype: Archetype) => rgbToString(get_rgb_of_Narmour_concept(archetype));
export const get_color_on_parametric_scale = (archetype: Archetype) => rgbToString(get_grb_on_parametric_scale(archetype));
export const get_color_on_intervallic_angle = (notes: (string | undefined)[]) => rgbToString(get_rgb_on_intervallic_angle(notes.map(e => e || "")));
