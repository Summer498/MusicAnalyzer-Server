import { RetrospectiveTriadSymbol } from "./symbols/retrospective-triad";
import { ProspectiveTriadSymbol } from "./symbols/prospective-triad";

export const retrospectiveSymbol = (symbol: ProspectiveTriadSymbol): RetrospectiveTriadSymbol => {
  switch (symbol) {
    case "P": return "(P)";
    case "IP": return "(IP)";
    case "VP": return "(VP)";
    case "R": return "(R)";
    case "IR": return "(IR)";
    case "VR": return "(VR)";
    case "D": return "(D)";
    case "ID": return "(ID)";
    default: throw new Error(`Illegal symbol given.\nExpected symbol: P, IP, VP, R, IR, VR, D, ID\n Given symbol:${symbol}`);
  }
};
