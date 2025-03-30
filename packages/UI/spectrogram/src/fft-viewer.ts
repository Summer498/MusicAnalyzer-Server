import { Complex } from "@music-analyzer/math";
import { AudioReflectable} from "@music-analyzer/view";
import { AudioAnalyzer } from "./audio-analyzer";

export class FFTViewer 
  implements AudioReflectable {
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
    const N = freqData[0].length / 2;
    const width = this.svg.clientWidth;
    const height = this.svg.clientHeight;
    let pathData = "";

    const abs = <T extends number>(e: Complex<T>) => Math.sqrt(e.re * e.re + e.im * e.im)
    const absV = (...c: [Float32Array<ArrayBuffer>, Float32Array<ArrayBuffer>]) =>
      c[0].map((e, i) => Math.sqrt(e * e + c[1][i] * c[1][i]))

    console.log("freqData[1]")
    console.log(
       absV(...freqData)
    )

    this.path.setAttribute("d", "M" +
//      freqData.map(e => abs(e))
        [...Array.from(absV(...freqData))]
        .map((e, i) => {
          if (isNaN(e * 0)) { return ``; }
          const x = i / (N - 1) * width;
          const y = (1 - Math.log2(1+e)) * height;
//          const y = (1 - Math.log2(1 + e) / 8) * height;
          return `L ${x},${y}`;
        })
        .join()
        .slice(1))

    /*
    for (let i = 0; i < N; i++) {
      if (isNaN(freqData[i].re * 0)) { continue; }
      const x = i / (N - 1) * width;
      const y = (1 - Math.log2(1 + abs(freqData[i])) / 8) * height;
      pathData += `L ${x},${y}`;
    }
    this.path.setAttribute("d", "M" + pathData.slice(1));
    */
  }
}
