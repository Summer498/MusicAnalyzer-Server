import { Archetype } from "../MelodicArchetype";

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
