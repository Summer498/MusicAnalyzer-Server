import { Archetype } from "../Archetype";

export const get_color_on_digital_intervallic_scale = (archetype: Archetype)  => {
  switch (archetype.symbol) {
    case "VP": case "(VP)": return "rgb(0, 0, 255)";
    case "P": case "(P)": return "rgb(0, 255, 0)";
    case "D": case "(D)": return "rgb(0, 255, 0)";
    case "IR": case "(IR)": return "rgb(255, 0, 0)";

    case "VR": case "(VR)": return "rgb(0, 0, 255)";
    case "IP": case "(IP)": return "rgb(0, 255, 0)";
    case "ID": case "(ID)": return "rgb(0, 255, 0)";
    case "R": case "(R)": return "rgb(255, 0, 0)";

    case "M":
    case "dyad": return "rgb(64, 64, 64)";
    default: return "rgb(0, 0, 0)";
  }
};
