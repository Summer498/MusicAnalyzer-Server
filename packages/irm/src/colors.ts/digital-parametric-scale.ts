import { Archetype } from "../archetype";

export const get_color_on_digital_parametric_scale = (archetype: Archetype)  => {
  switch (archetype.symbol) {
    case "VP": case "(VP)": return "rgb(0, 160, 255)";
    case "P": case "(P)": return "rgb(0, 0, 255)";
    case "D": case "(D)": return "rgb(0, 0, 255)";
    case "IR": case "(IR)": return "rgb(160, 0, 255)";

    case "VR": case "(VR)": return "rgb(0, 224, 0)";
    case "IP": case "(IP)": return "rgb(255, 160, 0)";
    case "ID": case "(ID)": return "rgb(255, 160, 0)";
    case "R": case "(R)": return "rgb(255, 0, 0)";

    default: return "rgb(64, 64, 64)";
  }
};
