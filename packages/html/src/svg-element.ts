import { recurrentArray } from "@music-analyzer/stdlib";
import { setComponentsToElement } from "./set-components-to-element";
import { attribute } from "./attribute";

export function svgElement<T extends keyof SVGElementTagNameMap>(
  qualifiedName: T,
  attributes?:attribute,
  text?:string,
  children?:recurrentArray<Element>,
) {
  return setComponentsToElement(
    document.createElementNS("http://www.w3.org/2000/svg", qualifiedName),
    attributes,
    text,
    children,
  );
}