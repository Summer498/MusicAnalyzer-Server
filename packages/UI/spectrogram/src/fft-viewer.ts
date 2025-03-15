import { Complex } from "@music-analyzer/math";
import { AudioReflectable } from "@music-analyzer/view";
import { AudioAnalyzer } from "./audio-analyzer";

export class FFTViewer implements AudioReflectable {
  private readonly path: SVGPathElement;
  readonly svg: SVGSVGElement;
  constructor(
    private readonly analyser: AudioAnalyzer,
  ) {
    this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.path.setAttribute("stroke", "rgb(192,0,255)");
    this.path.setAttribute("fill", "none");
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.appendChild(this.path);
    this.svg.id = "fft";
    this.svg.setAttribute("width", String(800));
    this.svg.setAttribute("height", String(450));
  }

  onAudioUpdate() {
    const freqData = this.analyser.getFFT();
    console.log("freqData")
    console.log(freqData)
    const N = freqData.length / 2;
    const width = this.svg.clientWidth;
    const height = this.svg.clientHeight;
    let pathData = "";

    const abs = <T extends number>(e: Complex<T>) => Math.sqrt(e.re * e.re + e.im * e.im)
    for (let i = 0; i < N; i++) {
      if (isNaN(freqData[i].re * 0)) { continue; }
      const x = i / (N - 1) * width;
      const y = (0.5 - Math.log2(abs(freqData[i])) / 16) * height;
      // const y = (1 - Math.log2(1 + freqData[i]) / 8) * height;
      pathData += `L ${x},${y}`;
    }
    this.path.setAttribute("d", "M" + pathData.slice(1));
  }
}
