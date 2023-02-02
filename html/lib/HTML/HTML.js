import { Arraying } from "../StdLib/stdlib.js";
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
Element.prototype.appendChildren = function (nodes) {
    for (const node of Arraying(nodes)) {
        this.appendChild(node);
    }
    return this;
};
function setComponentsToElement(element, attributes = {}, text = "", children = []) {
    for (const key in attributes) {
        element.setAttribute(key, String(attributes[key]));
    }
    element.appendChild(document.createTextNode(text));
    Arraying(children).forEach(child => element.appendChild(child));
    return element;
}
function htmlElement(tag, attributes = {}, text = "", children = []) {
    return setComponentsToElement(document.createElement(tag), attributes, text, children);
}
function svgElement(qualifiedName, attributes = {}, text = "", children = []) {
    return setComponentsToElement(document.createElementNS("http://www.w3.org/2000/svg", qualifiedName), attributes, text, children);
}
export class SVG {
    static svg(attributes = {}, text = "", children = []) { return svgElement("svg", attributes, text, children); }
    static g(attributes = {}, text = "", children = []) { return svgElement("g", attributes, text, children); }
    static rect(attributes = {}, text = "", children = []) { return svgElement("rect", attributes, text, children); }
    static line(attributes = {}, text = "", children = []) { return svgElement("line", attributes, text, children); }
    static text(attributes = {}, text = "", children = []) { return svgElement("text", attributes, text, children); }
}
export class HTML {
    // getters
    //get  () { return document.getElementsByTagName("") }
    static get base() { return document.getElementsByTagName("base")[0]; }
    static get head() { return document.getElementsByTagName("head")[0]; }
    static get body() { return document.getElementsByTagName("body")[0]; }
    static get title() { return document.getElementsByTagName("title")[0]; }
    // creators
    //(attributes: attribute={}, text: string = "", children: recurrentArray<Element> = []) { return htmlElement("", attributes, text, children) }
    static div(attributes = {}, text = "", children = []) { return htmlElement("div", attributes, text, children); }
    static span(attributes = {}, text = "", children = []) { return htmlElement("span", attributes, text, children); }
    static p(attributes = {}, text = "", children = []) { return htmlElement("p", attributes, text, children); }
    static h1(attributes = {}, text = "", children = []) { return htmlElement("h1", attributes, text, children); }
    static h2(attributes = {}, text = "", children = []) { return htmlElement("h2", attributes, text, children); }
    static h3(attributes = {}, text = "", children = []) { return htmlElement("h3", attributes, text, children); }
    static h4(attributes = {}, text = "", children = []) { return htmlElement("h4", attributes, text, children); }
    static h5(attributes = {}, text = "", children = []) { return htmlElement("h5", attributes, text, children); }
    static h6(attributes = {}, text = "", children = []) { return htmlElement("h6", attributes, text, children); }
    static ol(attributes = {}, text = "", children = []) { return htmlElement("ol", attributes, text, children); }
    static li(attributes = {}, text = "", children = []) { return htmlElement("li", attributes, text, children); }
    static script(attributes = {}, text = "", children = []) { return htmlElement("script", attributes, text, children); }
    static link(attributes = {}, text = "", children = []) { return htmlElement("link", attributes, text, children); }
}
