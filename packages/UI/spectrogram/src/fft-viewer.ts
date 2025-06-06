import { Complex } from "@music-analyzer/math";
import { AudioAnalyzer } from "./audio-analyzer";

export interface FFTViewer {
  readonly svg: SVGSVGElement;
  onAudioUpdate(): void;
}

export const createFFTViewer = (
  analyser: AudioAnalyzer,
): FFTViewer => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", "rgb(192,0,255)");
  path.setAttribute("fill", "none");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.appendChild(path);
  svg.id = "fft";
  svg.setAttribute("width", String(800));
  svg.setAttribute("height", String(450));

  const onAudioUpdate = () => {
    const freqData = analyser.getFFT();
    const N = freqData[0].length / 2;
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    let pathData = "";

    const abs = <T extends number>(e: Complex<T>) => Math.sqrt(e.re * e.re + e.im * e.im)
    const absV = (...c: [Float32Array<ArrayBuffer>, Float32Array<ArrayBuffer>]) =>
      c[0].map((e, i) => Math.sqrt(e * e + c[1][i] * c[1][i]))

    path.setAttribute("d", "M" +
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
    path.setAttribute("d", "M" + pathData.slice(1));
    */
  };

  return { svg, onAudioUpdate };
};
