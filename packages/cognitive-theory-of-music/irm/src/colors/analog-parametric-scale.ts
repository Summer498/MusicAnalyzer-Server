import { hsv2rgb } from "./facade";
import { rgbToString } from "./facade";
import { Dyad } from "../archetype/Dyad";
import { Monad } from "../archetype/Monad";
import { Null_ad } from "../archetype/Null-ad";
import { Triad } from "../archetype/triad/Triad";

const get_grb_on_parametric_scale = (archetype: Triad): [number, number, number] => {
  const s = archetype.intervallic?.direction.name === "mL" ? -1 : 0;
  const v = archetype.intervallic?.direction.name === "mR" ? -1 : 0;
  const scale = archetype.intervallic?.magnitude.name === "AA" ? 0.25 : 0.5;
  const B = 120;
  switch (archetype.registral?.direction.name) {
    case "mL": return hsv2rgb(-120 + B, 1 + s * scale, 1 + v * scale);
    case "mN": return hsv2rgb(0 + B, 1 + s * scale, 1 + v * scale);
    case "mR": return hsv2rgb(120 + B, 1 + s * scale, 1 + v * scale);
  }
  return [64, 64, 64]
};

export function get_color_on_parametric_scale(archetype: Triad) {
  if (
    archetype instanceof Dyad
    || archetype instanceof Monad
    || archetype instanceof Null_ad
  ) { return "rgb(64,64,64)" }
  return rgbToString(get_grb_on_parametric_scale(archetype))
}
