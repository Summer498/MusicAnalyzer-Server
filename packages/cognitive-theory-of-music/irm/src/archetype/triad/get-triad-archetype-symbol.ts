import { ProspectiveTriadSymbol } from "../symbols";
import { DirectionName } from "../../direction-name";
import { MagnitudeName } from "../../magnitude-name";

const getReverse = (
  I: DirectionName,
  V: DirectionName,
): ProspectiveTriadSymbol => {
  if (I !== "mL") { return "VR"; }
  else if (V !== "mL") { return "IR"; }
  else { return "R"; }
}

const getDuplication = (
  V: DirectionName,
): ProspectiveTriadSymbol => {
  if (V !== "mN") { return "ID" }
  else { return "D" }
}

const getProcessLike = (
  I: DirectionName,
  V: DirectionName,
): ProspectiveTriadSymbol => {
  if (V === "mR") { return "P" }
  else if (I === "mN") { return getDuplication(V); }
  else { return "IP" }
}

export const getTriadArchetypeSymbol = (
  Id: DirectionName,
  Im: MagnitudeName,
  V: DirectionName,
): ProspectiveTriadSymbol => {
  if (Im === "AA") { return getProcessLike(Id, V) }
  else if (V === "mL") { return getReverse(Id, V); }
  else if (Id === "mL") { return "IR"; }
  else { return "VP" }
}