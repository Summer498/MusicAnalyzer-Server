import { Dyad, Monad, Null_ad, Triad } from "../archetype";

export const get_color_of_Narmour_concept = (archetype: Triad | Dyad | Monad | Null_ad) => {
  switch (archetype.symbol) {
    case "VP": case "(VP)": return "rgb(0, 160, 255)";
    case "P": case "(P)": return "rgb(0, 0, 255)";
    case "IP": case "(IP)": return "rgb(160, 0, 255)";

    case "VR": case "(VR)": return "rgb(255, 0, 160)";
    case "R": case "(R)": return "rgb(255, 0, 0)";
    case "IR": case "(IR)": return "rgb(255, 160, 0)";

    case "D": case "(D)": return "rgb(0, 242, 0)";
    case "ID": case "(ID)": return "rgb(0, 255, 160)";

    default: return "rgb(64, 64, 64)";
  }
};
