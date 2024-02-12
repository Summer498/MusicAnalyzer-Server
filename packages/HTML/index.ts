import { Arraying, recurrentArray } from "../StdLib";

type attribute = { [key: string]: string | number };

declare global {
  interface Element {
    setAttributes: (attributes: attribute) => Element;
    setText: (text: string) => Element;
    appendChildren: (elements: recurrentArray<Element>) => Element;
  }
}

Element.prototype.setAttributes = function (attributes) {
  for (const key in attributes) {
    this.setAttribute(key, String(attributes[key]));
  }
  return this;
};
Element.prototype.setText = function (text) {
  this.appendChild(document.createTextNode(text));
  return this;
};
Element.prototype.appendChildren = function (nodes: recurrentArray<Element>) {
  for (const node of Arraying(nodes)) {
    this.appendChild(node);
  }
  return this;
};

function setComponentsToElement<T extends Element>(
  element: T,
  attributes: attribute = {},
  text = "",
  children: recurrentArray<Element> = [],
) {
  for (const key in attributes) {
    element.setAttribute(key, String(attributes[key]));
  }
  element.appendChild<Text>(document.createTextNode(text));
  Arraying(children).forEach((child) => element.appendChild(child));
  return element;
}

function htmlElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attributes: attribute = {},
  text = "",
  children: recurrentArray<Element> = [],
) {
  return setComponentsToElement(
    document.createElement<T>(tag),
    attributes,
    text,
    children,
  );
}

function svgElement<T extends keyof SVGElementTagNameMap>(
  qualifiedName: T,
  attributes: attribute = {},
  text = "",
  children: recurrentArray<Element> = [],
) {
  return setComponentsToElement(
    document.createElementNS("http://www.w3.org/2000/svg", qualifiedName),
    attributes,
    text,
    children,
  );
}

export class SVG {
  static svg(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return svgElement("svg", attributes, text, children);
  }
  static g(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return svgElement("g", attributes, text, children);
  }
  static circle(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return svgElement("circle", attributes, text, children);
  }
  static rect(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return svgElement("rect", attributes, text, children);
  }
  static polygon(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return svgElement("polygon", attributes, text, children);
  }
  static line(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return svgElement("line", attributes, text, children);
  }
  static text(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return svgElement("text", attributes, text, children);
  }
}

export class HTML {
  // getters
  //get  () { return document.getElementsByTagName("") }
  static get base() {
    return document.getElementsByTagName("base")[0];
  }
  static get head() {
    return document.getElementsByTagName("head")[0];
  }
  static get body() {
    return document.getElementsByTagName("body")[0];
  }
  static get title() {
    return document.getElementsByTagName("title")[0];
  }

  // creators
  //(attributes: attribute={}, text: string = "", children: recurrentArray<Element> = []) { return htmlElement("", attributes, text, children) }
  static div(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("div", attributes, text, children);
  }
  static span(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("span", attributes, text, children);
  }
  static p(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("p", attributes, text, children);
  }
  static h1(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("h1", attributes, text, children);
  }
  static h2(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("h2", attributes, text, children);
  }
  static h3(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("h3", attributes, text, children);
  }
  static h4(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("h4", attributes, text, children);
  }
  static h5(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("h5", attributes, text, children);
  }
  static h6(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("h6", attributes, text, children);
  }
  static ol(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("ol", attributes, text, children);
  }
  static li(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("li", attributes, text, children);
  }
  static script(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("script", attributes, text, children);
  }
  static link(
    attributes: attribute = {},
    text = "",
    children: recurrentArray<Element> = [],
  ) {
    return htmlElement("link", attributes, text, children);
  }
}
