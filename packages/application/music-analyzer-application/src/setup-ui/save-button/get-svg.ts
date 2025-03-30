import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { PianoRollWidth } from "@music-analyzer/view-parameters";

export const getSVG = (header_height?: number) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(PianoRollWidth.get()));
  svg.setAttribute("height", String(PianoRollHeight.get() + (header_height || 0)));
  svg.setAttribute("viewBox", `0 0 ${PianoRollWidth.get()} ${PianoRollHeight.get() + (header_height || 0)}`);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("xml:space", "preserve");
  svg.setAttribute("overflow", "hidden");
  return svg;
};
