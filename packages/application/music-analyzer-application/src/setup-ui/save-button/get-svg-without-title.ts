import { PianoRoll } from "@music-analyzer/piano-roll/src/piano-roll";
import { getG } from "./get-g";
import { getSVG } from "./get-svg";

export const getSVGwithoutTitle = (piano_roll_view: PianoRoll) => {
  const g = getG();
  g.innerHTML = piano_roll_view.svg.getHTML();

  const svg = getSVG();
  svg.appendChild(g);
  return svg.outerHTML;
};
