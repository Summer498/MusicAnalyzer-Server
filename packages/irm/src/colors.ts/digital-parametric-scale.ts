import { Archetype } from "../MelodicArchetype";

export const get_color_on_digital_parametric_scale = (archetype: Archetype)  => {
  switch (archetype._symbol) {
    case "VP": case "(VP)": return "#0af";
    case "P": case "(P)": return "#00f";
    case "D": case "(D)": return "#00f";
    case "IR": case "(IR)": return "#a0f";

    case "VR": case "(VR)": return "#0e0";
    case "IP": case "(IP)": return "#fa0";
    case "ID": case "(ID)": return "#fa0";
    case "R": case "(R)": return "#f00";

    case "M":
    case "dyad": return "#444";
    default: return "#000";
  }
};
