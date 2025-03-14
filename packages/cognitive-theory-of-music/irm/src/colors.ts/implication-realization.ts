import { Dyad, Monad, Null_ad, Triad } from "../archetype";

export const get_color_of_implication_realization = (archetype: Triad | Dyad | Monad | Null_ad) => {
  switch (archetype.symbol) {
    case "D": return "rgb(0,240,0)";
    case "ID": return "rgb(0, 0, 255)";

    case "VP": return "rgb(255, 0, 0)";
    case "P": return "rgb(0,240,0)";
    case "IP": return "rgb(0, 0, 255)";

    case "VR": return "rgb(255, 0, 0)";
    case "R": return "rgb(0,240,0)";
    case "IR": return "rgb(0, 0, 255)";

    
    case "(D)": return "rgb(0, 0, 0)";
    case "(ID)": return "rgb(255, 0, 0)";

    case "(VP)": return "rgb(0, 0, 0)";
    case "(P)": return "rgb(0, 0, 0)";
    case "(IP)": return "rgb(255, 0, 0)";

    case "(VR)": return "rgb(0, 0, 0)";
    case "(R)": return "rgb(0, 0, 0)";
    case "(IR)": return "rgb(255, 0, 0)";

    
    default: return "rgb(64, 64, 64)";
  }
};
