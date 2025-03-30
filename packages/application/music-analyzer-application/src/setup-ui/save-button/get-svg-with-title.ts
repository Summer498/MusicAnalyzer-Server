import { PianoRoll } from "@music-analyzer/piano-roll";
import { getHTML } from "./get-html";
import { getDiv } from "./get-div";
import { getH1 } from "./get-h1";
import { getForeignObject } from "./get-foreign-object";
import { getG } from "./get-g";
import { getSVG } from "./get-svg";

export const getSVGwithTitle = (title: HTMLHeadElement, piano_roll_view: PianoRoll, header_height: number) => {
  const h1 = getH1(title);

  const div = getDiv();
  div.appendChild(h1);

  const html = getHTML();
  html.appendChild(div);

  const foreign_object = getForeignObject(header_height);
  foreign_object.appendChild(html);

  const g = getG(header_height);
  g.innerHTML = piano_roll_view.svg.getHTML();

  const svg = getSVG(header_height);
  svg.appendChild(foreign_object);
  svg.appendChild(g);

  return svg.outerHTML;
};