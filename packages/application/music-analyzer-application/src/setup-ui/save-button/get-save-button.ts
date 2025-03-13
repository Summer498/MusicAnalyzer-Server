import { PianoRoll } from "@music-analyzer/svg-objects";
import { getSVGwithTitle } from "./get-svg-with-title";

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
