import { hsv2rgb, rgbToString } from "@music-analyzer/color";
import { Archetype } from "../archetype";

const get_grb_on_parametric_scale = (archetype: Archetype) => {
  const s = archetype.intervallic.direction.name === "mL" ? -1 : 0;
  const v = archetype.intervallic.direction.name === "mR" ? -1 : 0;
  const scale = archetype.intervallic.magnitude.name === "AA" ? 0.25 : 0.5;
  const B = 120;
  switch (archetype.registral.direction.name) {
    case "mL": return hsv2rgb(-120 + B, 1 + s * scale, 1 + v * scale);
    case "mN": return hsv2rgb(0 + B, 1 + s * scale, 1 + v * scale);
    case "mR": return hsv2rgb(120 + B, 1 + s * scale, 1 + v * scale);
  }
};
export const get_color_on_parametric_scale = (archetype: Archetype) => rgbToString(get_grb_on_parametric_scale(archetype));
