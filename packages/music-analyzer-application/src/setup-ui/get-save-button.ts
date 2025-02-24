import { PianoRollHeight, PianoRollWidth } from "@music-analyzer/view-parameters";
import { PianoRoll } from "@music-analyzer/svg-objects";

export const getSaveButton = (tune_id: string, title: HTMLHeadElement, piano_roll_view: PianoRoll) => {
  const save_button = document.createElement("input");
  save_button.value = "save analyzed result as SVG (with title)";
  save_button.setAttribute("type", "submit");
  const header_height = 96;
  function handleDownload() {
    const blob = new Blob([
      `<svg `
      + `width="${PianoRollWidth.value}" `
      + `height="${PianoRollHeight.value+header_height}" `
      + `viewBox="0 0 ${PianoRollWidth.value} ${PianoRollHeight.value+header_height}" `
      + `xmlns="http://www.w3.org/2000/svg" `
      + `xml:space="preserve" `
      + `overflow="hidden"`
      + `>`

      + `<foreignObject x="0" y="0" width="${PianoRollWidth.value}" height="${header_height}">`
      + `<html xmlns="http://www.w3.org/1999/xhtml">`
      + `<div style="background-color:white;width:100%;height:100%;">`
      + `<h1>`
      + `${title.textContent}`
      + `</h1>`
      + `</div>`
      + `</html>`
      + `</foreignObject>`

      + `<g transform="translate(0,${header_height})">`
      + `${piano_roll_view.svg.getHTML()}`
      + `</g>`
      + `</svg>`
    ], { "type": "text/plain" });
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
    const blob = new Blob([
      `<svg `
      + `width="${PianoRollWidth.value}" `
      + `height="${PianoRollHeight.value}" `
      + `viewBox="0 0 ${PianoRollWidth.value} ${PianoRollHeight.value}" `
      + `xmlns="http://www.w3.org/2000/svg" `
      + `xml:space="preserve" `
      + `overflow="hidden"`
      + `>`

      + `<g transform="translate(${0},${0})">`
      + `${piano_roll_view.svg.getHTML()}`
      + `</g>`
      + `</svg>`
    ], { "type": "text/plain" });
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
