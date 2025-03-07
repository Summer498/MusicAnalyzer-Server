import { Arraying, recurrentArray } from "@music-analyzer/stdlib";
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
  children && Arraying(children).forEach(child => element.appendChild(child));
  return element;
}
