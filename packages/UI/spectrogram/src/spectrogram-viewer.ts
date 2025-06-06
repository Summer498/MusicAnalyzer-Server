import { AudioAnalyzer } from "./audio-analyzer";

export interface spectrogramViewer {
  readonly svg: SVGSVGElement;
  onAudioUpdate(): void;
}

export const createSpectrogramViewer = (
  analyser: AudioAnalyzer,
): spectrogramViewer => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", "red");
  path.setAttribute("fill", "none");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.appendChild(path);
  svg.id = "spectrum";
  svg.setAttribute("width", String(800));
  svg.setAttribute("height", String(450));

  const onAudioUpdate = () => {
    const freqData = analyser.getFloatFrequencyData();
    const fftSize = freqData.length / 2;
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    let pathData = "";

    for (let i = 0; i < fftSize; i++) {
      if (isNaN(freqData[i] * 0)) { continue; }
      const x = i / (fftSize - 1) * width;
      const y = -(freqData[i] / 128) * height;
      pathData += `L ${x},${y}`;
    }
    [pathData]
      .map(e => e.slice(1))
      .filter(e => e.length > 0)
      .map(e => path.setAttribute("d", "M" + e));
  };

  return { svg, onAudioUpdate };
};
