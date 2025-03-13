import { Arraying, recurrentArray } from "@music-analyzer/stdlib";
import { attribute } from "./attribute";
export { attribute } from "./attribute";
export { htmlElement } from "./html-element";
export { svgElement } from "./svg-element";

declare global {
  interface Element {
    setAttributes: (attributes: attribute) => Element;
    appendChildren: (elements: recurrentArray<Element>) => Element;
  }
}

Element.prototype.setAttributes = function (attributes) {
  for (const key in attributes) {
    this.setAttribute(key, String(attributes[key]));
  }
  return this;
};

Element.prototype.appendChildren = function (nodes: recurrentArray<Element>) {
  for (const node of Arraying(nodes)) {
    this.appendChild(node);
  }
  return this;
};

