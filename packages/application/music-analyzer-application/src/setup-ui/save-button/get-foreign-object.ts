import { PianoRollWidth } from "./facade";

export const getForeignObject = (header_height: number) => {
  const foreign_object = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreign_object.setAttribute("x", "0");
  foreign_object.setAttribute("y", "0");
  foreign_object.setAttribute("width", String(PianoRollWidth.get()));
  foreign_object.setAttribute("height", String(header_height));
  return foreign_object;
};
