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

const empty_attribute: attribute = {};
const empty_elements: recurrentArray<Element> = [];

function setComponentsToElement<T extends Element>(
  element: T,
  attributes = empty_attribute,
  text = "",
  children = empty_elements,
) {
  for (const key in attributes) {
    element.setAttribute(key, String(attributes[key]));
  }
  element.appendChild<Text>(document.createTextNode(text));
  Arraying(children).forEach(child => element.appendChild(child));
  return element;
}

function htmlElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attributes = empty_attribute,
  text = "",
  children = empty_elements,
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
  attributes = empty_attribute,
  text = "",
  children = empty_elements,
) {
  return setComponentsToElement(
    document.createElementNS("http://www.w3.org/2000/svg", qualifiedName),
    attributes,
    text,
    children,
  );
}

export class SVG {
  static a(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("a", attributes, text, children); }
  static animate(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("animate", attributes, text, children); }
  static animateMotion(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("animateMotion", attributes, text, children); }
  static animateTransform(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("animateTransform", attributes, text, children); }
  static circle(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("circle", attributes, text, children); }
  static clipPath(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("clipPath", attributes, text, children); }
  static defs(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("defs", attributes, text, children); }
  static desc(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("desc", attributes, text, children); }
  static ellipse(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("ellipse", attributes, text, children); }
  static feBlend(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feBlend", attributes, text, children); }
  static feColorMatrix(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feColorMatrix", attributes, text, children); }
  static feComponentTransfer(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feComponentTransfer", attributes, text, children); }
  static feComposite(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feComposite", attributes, text, children); }
  static feConvolveMatrix(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feConvolveMatrix", attributes, text, children); }
  static feDiffuseLighting(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feDiffuseLighting", attributes, text, children); }
  static feDisplacementMap(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feDisplacementMap", attributes, text, children); }
  static feDistantLight(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feDistantLight", attributes, text, children); }
  static feDropShadow(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feDropShadow", attributes, text, children); }
  static feFlood(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feFlood", attributes, text, children); }
  static feFuncA(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feFuncA", attributes, text, children); }
  static feFuncB(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feFuncB", attributes, text, children); }
  static feFuncG(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feFuncG", attributes, text, children); }
  static feFuncR(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feFuncR", attributes, text, children); }
  static feGaussianBlur(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feGaussianBlur", attributes, text, children); }
  static feImage(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feImage", attributes, text, children); }
  static feMerge(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feMerge", attributes, text, children); }
  static feMergeNode(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feMergeNode", attributes, text, children); }
  static feMorphology(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feMorphology", attributes, text, children); }
  static feOffset(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feOffset", attributes, text, children); }
  static fePointLight(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("fePointLight", attributes, text, children); }
  static feSpecularLighting(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feSpecularLighting", attributes, text, children); }
  static feSpotLight(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feSpotLight", attributes, text, children); }
  static feTile(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feTile", attributes, text, children); }
  static feTurbulence(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("feTurbulence", attributes, text, children); }
  static filter(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("filter", attributes, text, children); }
  static foreignObject(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("foreignObject", attributes, text, children); }
  static g(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("g", attributes, text, children); }
  static image(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("image", attributes, text, children); }
  static line(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("line", attributes, text, children); }
  static linearGradient(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("linearGradient", attributes, text, children); }
  static marker(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("marker", attributes, text, children); }
  static mask(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("mask", attributes, text, children); }
  static metadata(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("metadata", attributes, text, children); }
  static mpath(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("mpath", attributes, text, children); }
  static path(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("path", attributes, text, children); }
  static pattern(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("pattern", attributes, text, children); }
  static polygon(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("polygon", attributes, text, children); }
  static polyline(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("polyline", attributes, text, children); }
  static radialGradient(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("radialGradient", attributes, text, children); }
  static rect(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("rect", attributes, text, children); }
  static script(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("script", attributes, text, children); }
  static set(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("set", attributes, text, children); }
  static stop(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("stop", attributes, text, children); }
  static style(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("style", attributes, text, children); }
  static svg(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("svg", attributes, text, children); }
  static switch(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("switch", attributes, text, children); }
  static symbol(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("symbol", attributes, text, children); }
  static text(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("text", attributes, text, children); }
  static textPath(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("textPath", attributes, text, children); }
  static title(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("title", attributes, text, children); }
  static tspan(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("tspan", attributes, text, children); }
  static use(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("use", attributes, text, children); }
  static view(attributes = empty_attribute, text = "", children = empty_elements) { return svgElement("view", attributes, text, children); }
}

export class HTML {
  // getters
  // get  () { return document.getElementsByTagName("") }
  static get base() { return document.getElementsByTagName("base")[0]; }
  static get head() { return document.getElementsByTagName("head")[0]; }
  static get body() { return document.getElementsByTagName("body")[0]; }
  static get title() { return document.getElementsByTagName("title")[0]; }
  // creators
  //(attributes = empty_attribute, text: string = "", children= empty_elements) { return htmlElement("", attributes, text, children) }
  static a(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("a", attributes, text, children); }
  static abbr(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("abbr", attributes, text, children); }
  static address(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("address", attributes, text, children); }
  static area(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("area", attributes, text, children); }
  static article(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("article", attributes, text, children); }
  static aside(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("aside", attributes, text, children); }
  static audio(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("audio", attributes, text, children); }
  static b(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("b", attributes, text, children); }
  // static base(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("base", attributes, text, children); }
  static bdi(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("bdi", attributes, text, children); }
  static bdo(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("bdo", attributes, text, children); }
  static blockquote(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("blockquote", attributes, text, children); }
  // static body(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("body", attributes, text, children); }
  static br(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("br", attributes, text, children); }
  static button(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("button", attributes, text, children); }
  static canvas(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("canvas", attributes, text, children); }
  static caption(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("caption", attributes, text, children); }
  static cite(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("cite", attributes, text, children); }
  static code(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("code", attributes, text, children); }
  static col(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("col", attributes, text, children); }
  static colgroup(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("colgroup", attributes, text, children); }
  static data(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("data", attributes, text, children); }
  static datalist(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("datalist", attributes, text, children); }
  static dd(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("dd", attributes, text, children); }
  static del(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("del", attributes, text, children); }
  static details(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("details", attributes, text, children); }
  static dfn(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("dfn", attributes, text, children); }
  static dialog(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("dialog", attributes, text, children); }
  static div(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("div", attributes, text, children); }
  static dl(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("dl", attributes, text, children); }
  static dt(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("dt", attributes, text, children); }
  static em(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("em", attributes, text, children); }
  static embed(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("embed", attributes, text, children); }
  static fieldset(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("fieldset", attributes, text, children); }
  static figcaption(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("figcaption", attributes, text, children); }
  static figure(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("figure", attributes, text, children); }
  static footer(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("footer", attributes, text, children); }
  static form(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("form", attributes, text, children); }
  static h1(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("h1", attributes, text, children); }
  static h2(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("h2", attributes, text, children); }
  static h3(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("h3", attributes, text, children); }
  static h4(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("h4", attributes, text, children); }
  static h5(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("h5", attributes, text, children); }
  static h6(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("h6", attributes, text, children); }
  // static head(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("head", attributes, text, children); }
  static header(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("header", attributes, text, children); }
  static hgroup(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("hgroup", attributes, text, children); }
  static hr(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("hr", attributes, text, children); }
  static html(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("html", attributes, text, children); }
  static i(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("i", attributes, text, children); }
  static iframe(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("iframe", attributes, text, children); }
  static img(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("img", attributes, text, children); }
  static input(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("input", attributes, text, children); }
  static ins(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("ins", attributes, text, children); }
  static kbd(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("kbd", attributes, text, children); }
  static label(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("label", attributes, text, children); }
  static legend(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("legend", attributes, text, children); }
  static li(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("li", attributes, text, children); }
  static link(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("link", attributes, text, children); }
  static main(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("main", attributes, text, children); }
  static map(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("map", attributes, text, children); }
  static mark(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("mark", attributes, text, children); }
  static menu(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("menu", attributes, text, children); }
  static meta(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("meta", attributes, text, children); }
  static meter(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("meter", attributes, text, children); }
  static nav(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("nav", attributes, text, children); }
  static noscript(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("noscript", attributes, text, children); }
  static object(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("object", attributes, text, children); }
  static ol(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("ol", attributes, text, children); }
  static optgroup(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("optgroup", attributes, text, children); }
  static option(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("option", attributes, text, children); }
  static output(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("output", attributes, text, children); }
  static p(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("p", attributes, text, children); }
  static picture(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("picture", attributes, text, children); }
  static pre(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("pre", attributes, text, children); }
  static progress(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("progress", attributes, text, children); }
  static q(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("q", attributes, text, children); }
  static rp(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("rp", attributes, text, children); }
  static rt(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("rt", attributes, text, children); }
  static ruby(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("ruby", attributes, text, children); }
  static s(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("s", attributes, text, children); }
  static samp(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("samp", attributes, text, children); }
  static script(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("script", attributes, text, children); }
  static search(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("search", attributes, text, children); }
  static section(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("section", attributes, text, children); }
  static select(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("select", attributes, text, children); }
  static slot(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("slot", attributes, text, children); }
  static small(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("small", attributes, text, children); }
  static source(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("source", attributes, text, children); }
  static span(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("span", attributes, text, children); }
  static strong(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("strong", attributes, text, children); }
  static style(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("style", attributes, text, children); }
  static sub(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("sub", attributes, text, children); }
  static summary(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("summary", attributes, text, children); }
  static sup(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("sup", attributes, text, children); }
  static table(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("table", attributes, text, children); }
  static tbody(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("tbody", attributes, text, children); }
  static td(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("td", attributes, text, children); }
  static template(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("template", attributes, text, children); }
  static textarea(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("textarea", attributes, text, children); }
  static tfoot(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("tfoot", attributes, text, children); }
  static th(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("th", attributes, text, children); }
  static thead(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("thead", attributes, text, children); }
  static time(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("time", attributes, text, children); }
  // static title(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("title", attributes, text, children); }
  static tr(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("tr", attributes, text, children); }
  static track(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("track", attributes, text, children); }
  static u(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("u", attributes, text, children); }
  static ul(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("ul", attributes, text, children); }
  static var(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("var", attributes, text, children); }
  static video(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("video", attributes, text, children); }
  static wbr(attributes = empty_attribute, text = "", children = empty_elements) { return htmlElement("wbr", attributes, text, children); }
}


