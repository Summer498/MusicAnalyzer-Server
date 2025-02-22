import { Archetype } from "../MelodicArchetype";

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
