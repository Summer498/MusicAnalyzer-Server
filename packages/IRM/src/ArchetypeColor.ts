import { Archetype } from "./MelodicArchetype";
import { hsv2rgb } from "../../Color";

export const get_color_of_Narmour_concept = (archetype: Archetype) => {
  switch (archetype.symbol) {
    case "P": return [0x00, 0x00, 0xff];
    case "IP": return [0x44, 0x44, 0xff];
    case "VP": return [0x00, 0x00, 0xcc];
    case "R": return [0xff, 0x00, 0x00];
    case "IR": return [0xff, 0x44, 0x44];
    case "VR": return [0xcc, 0x00, 0x00];
    case "D": return [0x00, 0xff, 0x00];
    case "ID": return [0x44, 0xff, 0x44];
    default: return [0x00, 0x00, 0x00];
  }
};

export const get_color_on_parametric_scale = (archetype: Archetype) => {
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
