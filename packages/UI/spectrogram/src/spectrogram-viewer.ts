import { AudioAnalyzer } from "./audio-analyzer";

export class spectrogramViewer {
  private readonly path: SVGPathElement;
  readonly svg: SVGSVGElement;
  constructor(
    private readonly analyser: AudioAnalyzer,
  ) {
    this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.path.setAttribute("stroke", "red");
    this.path.setAttribute("fill", "none");
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.appendChild(this.path);
    this.svg.id = "spectrum";
    this.svg.setAttribute("width", String(800));
    this.svg.setAttribute("height", String(450));
  }

  onAudioUpdate() {
    const freqData = this.analyser.getFloatFrequencyData();
    const fftSize = freqData.length/2;
    const width = this.svg.clientWidth;
    const height = this.svg.clientHeight;
    let pathData = "";

    for (let i = 0; i < fftSize; i++) {
      if (isNaN(freqData[i] * 0)) { continue; }
      const x = i / (fftSize - 1) * width;
      const y = -(freqData[i] / 128) * height;
      pathData += `L ${x},${y}`;
    }
    this.path.setAttribute("d", "M" + pathData.slice(1));
  }
}
