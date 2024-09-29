import { Arraying, recurrentArray } from "@music-analyzer/stdlib";

type attribute = { [key: string]: string | number };

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

function setComponentsToElement<T extends Element>(
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

function htmlElement<T extends keyof HTMLElementTagNameMap>(
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

function svgElement<T extends keyof SVGElementTagNameMap>(
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

export class SVG {
  static a(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("a", attributes, text, children); }
  static animate(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("animate", attributes, text, children); }
  static animateMotion(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("animateMotion", attributes, text, children); }
  static animateTransform(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("animateTransform", attributes, text, children); }
  static circle(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("circle", attributes, text, children); }
  static clipPath(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("clipPath", attributes, text, children); }
  static defs(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("defs", attributes, text, children); }
  static desc(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("desc", attributes, text, children); }
  static ellipse(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("ellipse", attributes, text, children); }
  static feBlend(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feBlend", attributes, text, children); }
  static feColorMatrix(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feColorMatrix", attributes, text, children); }
  static feComponentTransfer(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feComponentTransfer", attributes, text, children); }
  static feComposite(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feComposite", attributes, text, children); }
  static feConvolveMatrix(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feConvolveMatrix", attributes, text, children); }
  static feDiffuseLighting(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feDiffuseLighting", attributes, text, children); }
  static feDisplacementMap(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feDisplacementMap", attributes, text, children); }
  static feDistantLight(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feDistantLight", attributes, text, children); }
  static feDropShadow(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feDropShadow", attributes, text, children); }
  static feFlood(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feFlood", attributes, text, children); }
  static feFuncA(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feFuncA", attributes, text, children); }
  static feFuncB(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feFuncB", attributes, text, children); }
  static feFuncG(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feFuncG", attributes, text, children); }
  static feFuncR(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feFuncR", attributes, text, children); }
  static feGaussianBlur(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feGaussianBlur", attributes, text, children); }
  static feImage(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feImage", attributes, text, children); }
  static feMerge(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feMerge", attributes, text, children); }
  static feMergeNode(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feMergeNode", attributes, text, children); }
  static feMorphology(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feMorphology", attributes, text, children); }
  static feOffset(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feOffset", attributes, text, children); }
  static fePointLight(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("fePointLight", attributes, text, children); }
  static feSpecularLighting(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feSpecularLighting", attributes, text, children); }
  static feSpotLight(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feSpotLight", attributes, text, children); }
  static feTile(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feTile", attributes, text, children); }
  static feTurbulence(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("feTurbulence", attributes, text, children); }
  static filter(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("filter", attributes, text, children); }
  static foreignObject(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("foreignObject", attributes, text, children); }
  static g(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("g", attributes, text, children); }
  static image(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("image", attributes, text, children); }
  static line(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("line", attributes, text, children); }
  static linearGradient(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("linearGradient", attributes, text, children); }
  static marker(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("marker", attributes, text, children); }
  static mask(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("mask", attributes, text, children); }
  static metadata(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("metadata", attributes, text, children); }
  static mpath(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("mpath", attributes, text, children); }
  static path(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("path", attributes, text, children); }
  static pattern(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("pattern", attributes, text, children); }
  static polygon(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("polygon", attributes, text, children); }
  static polyline(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("polyline", attributes, text, children); }
  static radialGradient(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("radialGradient", attributes, text, children); }
  static rect(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("rect", attributes, text, children); }
  static script(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("script", attributes, text, children); }
  static set(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("set", attributes, text, children); }
  static stop(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("stop", attributes, text, children); }
  static style(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("style", attributes, text, children); }
  static svg(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("svg", attributes, text, children); }
  static switch(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("switch", attributes, text, children); }
  static symbol(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("symbol", attributes, text, children); }
  static text(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("text", attributes, text, children); }
  static textPath(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("textPath", attributes, text, children); }
  static title(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("title", attributes, text, children); }
  static tspan(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("tspan", attributes, text, children); }
  static use(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("use", attributes, text, children); }
  static view(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return svgElement("view", attributes, text, children); }
}

export class HTML {
  // getters
  // get  () { return document.getElementsByTagName("") }
  static get base() { return document.getElementsByTagName("base")[0]; }
  static get head() { return document.getElementsByTagName("head")[0]; }
  static get body() { return document.getElementsByTagName("body")[0]; }
  static get title() { return document.getElementsByTagName("title")[0]; }
  // creators
  //(attributes?: attribute, text: string = "", children= empty_elements) { return htmlElement("", attributes, text, children) }
  static a(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("a", attributes, text, children); }
  static abbr(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("abbr", attributes, text, children); }
  static address(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("address", attributes, text, children); }
  static area(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("area", attributes, text, children); }
  static article(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("article", attributes, text, children); }
  static aside(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("aside", attributes, text, children); }
  static audio(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("audio", attributes, text, children); }
  static b(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("b", attributes, text, children); }
  // static base(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("base", attributes, text, children); }
  static bdi(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("bdi", attributes, text, children); }
  static bdo(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("bdo", attributes, text, children); }
  static blockquote(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("blockquote", attributes, text, children); }
  // static body(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("body", attributes, text, children); }
  static br(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("br", attributes, text, children); }
  static button(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("button", attributes, text, children); }
  static canvas(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("canvas", attributes, text, children); }
  static caption(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("caption", attributes, text, children); }
  static cite(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("cite", attributes, text, children); }
  static code(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("code", attributes, text, children); }
  static col(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("col", attributes, text, children); }
  static colgroup(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("colgroup", attributes, text, children); }
  static data(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("data", attributes, text, children); }
  static datalist(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("datalist", attributes, text, children); }
  static dd(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("dd", attributes, text, children); }
  static del(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("del", attributes, text, children); }
  static details(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("details", attributes, text, children); }
  static dfn(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("dfn", attributes, text, children); }
  static dialog(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("dialog", attributes, text, children); }
  static div(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("div", attributes, text, children); }
  static dl(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("dl", attributes, text, children); }
  static dt(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("dt", attributes, text, children); }
  static em(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("em", attributes, text, children); }
  static embed(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("embed", attributes, text, children); }
  static fieldset(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("fieldset", attributes, text, children); }
  static figcaption(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("figcaption", attributes, text, children); }
  static figure(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("figure", attributes, text, children); }
  static footer(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("footer", attributes, text, children); }
  static form(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("form", attributes, text, children); }
  static h1(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("h1", attributes, text, children); }
  static h2(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("h2", attributes, text, children); }
  static h3(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("h3", attributes, text, children); }
  static h4(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("h4", attributes, text, children); }
  static h5(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("h5", attributes, text, children); }
  static h6(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("h6", attributes, text, children); }
  // static head(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("head", attributes, text, children); }
  static header(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("header", attributes, text, children); }
  static hgroup(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("hgroup", attributes, text, children); }
  static hr(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("hr", attributes, text, children); }
  static html(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("html", attributes, text, children); }
  static i(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("i", attributes, text, children); }
  static iframe(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("iframe", attributes, text, children); }
  static img(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("img", attributes, text, children); }
  static input(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", attributes, text, children); }

  static input_button(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "button" }, text, children); }
  static input_checkbox(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "checkbox" }, text, children); }
  static input_color(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "color" }, text, children); }
  static input_date(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "date" }, text, children); }
  static input_datetime_local(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "datetime-local" }, text, children); }
  static input_email(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "email" }, text, children); }
  static input_file(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "file" }, text, children); }
  static input_hidden(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "hidden" }, text, children); }
  static input_image(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "image" }, text, children); }
  static input_month(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "month" }, text, children); }
  static input_number(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "number" }, text, children); }
  static input_password(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "password" }, text, children); }
  static input_radio(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "radio" }, text, children); }
  static input_range(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "range" }, text, children); }
  static input_reset(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "reset" }, text, children); }
  static input_search(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "search" }, text, children); }
  static input_submit(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "submit" }, text, children); }
  static input_tel(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "tel" }, text, children); }
  static input_text(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "text" }, text, children); }
  static input_time(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "time" }, text, children); }
  static input_url(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "url" }, text, children); }
  static input_week(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("input", { ...attributes, type: "week" }, text, children); }

  static ins(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("ins", attributes, text, children); }
  static kbd(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("kbd", attributes, text, children); }
  static label(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("label", attributes, text, children); }
  static legend(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("legend", attributes, text, children); }
  static li(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("li", attributes, text, children); }
  static link(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("link", attributes, text, children); }
  static main(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("main", attributes, text, children); }
  static map(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("map", attributes, text, children); }
  static mark(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("mark", attributes, text, children); }
  static menu(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("menu", attributes, text, children); }
  static meta(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("meta", attributes, text, children); }
  static meter(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("meter", attributes, text, children); }
  static nav(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("nav", attributes, text, children); }
  static noscript(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("noscript", attributes, text, children); }
  static object(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("object", attributes, text, children); }
  static ol(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("ol", attributes, text, children); }
  static optgroup(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("optgroup", attributes, text, children); }
  static option(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("option", attributes, text, children); }
  static output(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("output", attributes, text, children); }
  static p(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("p", attributes, text, children); }
  static picture(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("picture", attributes, text, children); }
  static pre(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("pre", attributes, text, children); }
  static progress(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("progress", attributes, text, children); }
  static q(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("q", attributes, text, children); }
  static rp(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("rp", attributes, text, children); }
  static rt(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("rt", attributes, text, children); }
  static ruby(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("ruby", attributes, text, children); }
  static s(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("s", attributes, text, children); }
  static samp(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("samp", attributes, text, children); }
  static script(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("script", attributes, text, children); }
  static search(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("search", attributes, text, children); }
  static section(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("section", attributes, text, children); }
  static select(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("select", attributes, text, children); }
  static slot(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("slot", attributes, text, children); }
  static small(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("small", attributes, text, children); }
  static source(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("source", attributes, text, children); }
  static span(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("span", attributes, text, children); }
  static strong(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("strong", attributes, text, children); }
  static style(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("style", attributes, text, children); }
  static sub(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("sub", attributes, text, children); }
  static summary(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("summary", attributes, text, children); }
  static sup(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("sup", attributes, text, children); }
  static table(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("table", attributes, text, children); }
  static tbody(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("tbody", attributes, text, children); }
  static td(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("td", attributes, text, children); }
  static template(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("template", attributes, text, children); }
  static textarea(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("textarea", attributes, text, children); }
  static tfoot(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("tfoot", attributes, text, children); }
  static th(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("th", attributes, text, children); }
  static thead(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("thead", attributes, text, children); }
  static time(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("time", attributes, text, children); }
  // static title(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("title", attributes, text, children); }
  static tr(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("tr", attributes, text, children); }
  static track(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("track", attributes, text, children); }
  static u(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("u", attributes, text, children); }
  static ul(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("ul", attributes, text, children); }
  static var(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("var", attributes, text, children); }
  static video(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("video", attributes, text, children); }
  static wbr(attributes?: attribute, text?: string, children?: recurrentArray<Element>) { return htmlElement("wbr", attributes, text, children); }
}


