import { Archetype } from "../Archetype";

export const get_color_of_Narmour_concept = (archetype: Archetype) => {
  switch (archetype._symbol) {
    case "VP": case "(VP)": return "#0af";
    case "P": case "(P)": return "#00f";
    case "IP": case "(IP)": return "#a0f";

    case "VR": case "(VR)": return "#f0a";
    case "R": case "(R)": return "#f00";
    case "IR": case "(IR)": return "#fa0";

    case "D": case "(D)": return "#0e0";
    case "ID": case "(ID)": return "#0fa";
    case "M":
    case "dyad": return "#444";
    default: return "#000";
  }
};
