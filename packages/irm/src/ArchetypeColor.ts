import { _Interval } from "@music-analyzer/tonal-objects";
import { Archetype } from "./MelodicArchetype";
import { hsv2rgb, rgbToString } from "@music-analyzer/color";

export const get_color_of_Narmour_concept = (archetype: Archetype) => {
  switch (archetype._symbol) {
    case "VP": case "(VP)": return "#0af";
    case "P": case "(P)": return "#00f";
    case "IP": case "(IP)": return "#a0f";

    case "VR": case "(VR)": return "#f0a";
    case "R": case "(R)": return "#f00";
    case "IR": case "(IR)": return "#fa0";

    case "D": case "(D)": return "#0e00";
    case "ID": case "(ID)": return "#0fa";
    case "M":
    case "dyad": return "#444";
    default: return "#000";
  }
};

export const get_color_on_digital_parametric_scale = (archetype: Archetype)  => {
  throw new Error("get_color_on_digital_parametric_scale is not implemented");
  // get_color_on_registral_scale と同じになっている.
  // TODO: intervallic, registral 双方を含むような色配置にする
  switch (archetype._symbol) {
    case "VP": case "(VP)": return "#00f";
    case "P": case "(P)": return "#0ff";
    case "D": case "(D)": return "#0ff";
    case "IR": case "(IR)": return "#f0f";

    case "VR": case "(VR)": return "#f0f";
    case "IP": case "(IP)": return "#ff0";
    case "ID": case "(ID)": return "#ff0";
    case "R": case "(R)": return "#f00";

    case "M":
    case "dyad": return "#444";
    default: return "#000";
  }
};

export const get_color_on_digital_intervallic_scale = (archetype: Archetype)  => {
  switch (archetype._symbol) {
    case "VP": case "(VP)": return "#00f";
    case "P": case "(P)": return "#0f0";
    case "D": case "(D)": return "#0f0";
    case "IR": case "(IR)": return "#f00";

    case "VR": case "(VR)": return "#00f";
    case "IP": case "(IP)": return "#0f0";
    case "ID": case "(ID)": return "#0f0";
    case "R": case "(R)": return "#f00";

    case "M":
    case "dyad": return "#444";
    default: return "#000";
  }
};

export const get_color_on_registral_scale = (archetype: Archetype)  => {
  switch (archetype._symbol) {
    case "VP": case "(VP)": return "#00f";
    case "P": case "(P)": return "#00f";
    case "D": case "(D)": return "#00f";
    case "IR": case "(IR)": return "#00f";

    case "VR": case "(VR)": return "#f00";
    case "IP": case "(IP)": return "#f00";
    case "ID": case "(ID)": return "#f00";
    case "R": case "(R)": return "#f00";

    case "M":
    case "dyad": return "#444";
    default: return "#000";
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
  const dist = (p => Math.tanh(p[0] * p[0] + p[1] * p[1]))(intervals) || 0;
  const angle = Math.atan2(intervals[1], intervals[0]) || 0;
  return hsv2rgb(angle * 360 / Math.PI, 1, dist);
};

export const get_color_on_parametric_scale = (archetype: Archetype) => rgbToString(get_grb_on_parametric_scale(archetype));
export const get_color_on_intervallic_angle = (notes: (string | undefined)[]) => rgbToString(get_rgb_on_intervallic_angle(notes.map(e => e || "")));
