import { Dyad, Monad, Null_ad, Triad } from "../archetype";

export const get_color_on_registral_scale = (archetype: Triad | Dyad | Monad | Null_ad)  => {
  switch (archetype.symbol) {
    case "VP": case "(VP)": return "rgb(0, 0, 255)";
    case "P": case "(P)": return "rgb(0, 0, 255)";
    case "D": case "(D)": return "rgb(0, 0, 255)";
    case "IR": case "(IR)": return "rgb(0, 0, 255)";

    case "VR": case "(VR)": return "rgb(255, 0, 0)";
    case "IP": case "(IP)": return "rgb(255, 0, 0)";
    case "ID": case "(ID)": return "rgb(255, 0, 0)";
    case "R": case "(R)": return "rgb(255, 0, 0)";

    default: return "rgb(64, 64, 64)";
  }
};
