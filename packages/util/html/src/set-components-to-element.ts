import { Arraying } from "@music-analyzer/stdlib/src/array-of-array/to-array";
import { recurrentArray } from "@music-analyzer/stdlib/src/array-of-array/array-of-array";
import { attribute } from "./attribute";

export function setComponentsToElement<T extends Element>(
  element: T,
  attributes?: attribute,
  text?: string,
  children?: recurrentArray<Element>,
) {
  for (const key in attributes) {
    element.setAttribute(key, String(attributes[key]));
  }
  text && element.appendChild(document.createTextNode(text));
  children &&
    Arraying(children).forEach((child: Element) => element.appendChild(child));
  return element;
}
