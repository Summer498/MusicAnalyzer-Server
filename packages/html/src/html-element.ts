import { recurrentArray } from "@music-analyzer/stdlib";
import { setComponentsToElement } from "./set-components-to-element";
import { attribute } from "./attribute";

export function htmlElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attributes?:attribute,
  text?:string,
  children?:recurrentArray<Element>,
) {
  return setComponentsToElement(
    document.createElement<T>(tag),
    attributes,
    text,
    children,
  );
}
