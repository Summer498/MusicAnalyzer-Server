import { PianoRollHeight, PianoRollWidth } from "@music-analyzer/view-parameters";
import { PianoRoll } from "@music-analyzer/svg-objects";

const getH1 = (title: HTMLHeadElement) => {
  const h1 = document.createElement("h1");
  h1.textContent = title.textContent;
  return h1;
};

const getDiv = () => {
  const div = document.createElement("div");
  div.style.backgroundColor = "white";
  div.style.width = `${100}%`;
  div.style.height = `${100}%`;
  return div;
};

const getHTML = () => {
  const html = document.createElement("html");
  html.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  return html;
};

const getForeignObject = (header_height: number) => {
  const foreign_object = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreign_object.setAttribute("x", "0");
  foreign_object.setAttribute("y", "0");
  foreign_object.setAttribute("width", String(PianoRollWidth.get()));
  foreign_object.setAttribute("height", String(header_height));
  return foreign_object;
};

const getG = (header_height?: number) => {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${0},${header_height || 0})`);
  return g;
};

const getSVG = (header_height?: number) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(PianoRollWidth.get()));
  svg.setAttribute("height", String(PianoRollHeight.value + (header_height || 0)));
  svg.setAttribute("viewBox", `0 0 ${PianoRollWidth.get()} ${PianoRollHeight.value + (header_height || 0)}`);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("xml:space", "preserve");
  svg.setAttribute("overflow", "hidden");
  return svg;
};

const getSVGwithTitle = (title: HTMLHeadElement, piano_roll_view: PianoRoll, header_height: number) => {
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

const getSVGwithoutTitle = (piano_roll_view: PianoRoll) => {
  const g = getG();
  g.innerHTML = piano_roll_view.svg.getHTML();

  const svg = getSVG();
  svg.appendChild(g);
  return svg.outerHTML;
};

export const getSaveButton = (tune_id: string, title: HTMLHeadElement, piano_roll_view: PianoRoll) => {
  const save_button = document.createElement("input");
  save_button.value = "save analyzed result as SVG (with title)";
  save_button.setAttribute("type", "submit");
  const header_height = 96;
  function handleDownload() {
    const blob = new Blob([getSVGwithTitle(title, piano_roll_view, header_height)], { "type": "text/plain" });
    const download_link = document.createElement("a");
    download_link.setAttribute("download", `${tune_id}.svg`);
    download_link.setAttribute("href", window.URL.createObjectURL(blob));
    download_link.click();
  }
  save_button.onclick = e => {
    handleDownload();
  };
  return save_button;
};

export const getRawSaveButton = (tune_id: string, title: HTMLHeadElement, piano_roll_view: PianoRoll) => {
  const save_button = document.createElement("input");
  save_button.value = "save analyzed result as SVG (without title)";
  save_button.setAttribute("type", "submit");
  function handleDownload() {
    const blob = new Blob([getSVGwithoutTitle(piano_roll_view)], { "type": "text/plain" });
    const download_link = document.createElement("a");
    download_link.setAttribute("download", `${tune_id}.svg`);
    download_link.setAttribute("href", window.URL.createObjectURL(blob));
    download_link.click();
  }
  save_button.onclick = e => {
    handleDownload();
  };
  return save_button;
};
