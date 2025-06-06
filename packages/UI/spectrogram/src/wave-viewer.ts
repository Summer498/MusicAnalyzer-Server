import { createComplex, correlation } from "@music-analyzer/math";
import type { Complex } from "@music-analyzer/math";
import { AudioAnalyzer } from "./audio-analyzer";

export interface WaveViewer {
  readonly svg: SVGSVGElement;
  onAudioUpdate(): void;
}

export const createWaveViewer = (analyser: AudioAnalyzer): WaveViewer => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke", "blue");
  path.setAttribute("fill", "none");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.appendChild(path);
  svg.id = "sound-wave";
  svg.setAttribute("width", String(800));
  svg.setAttribute("height", String(450));
  const old_wave = Array.from({ length: analyser.analyser.fftSize }, () => createComplex(0, 0));

  const getDelay = (copy: Complex<number>[]) => {
    const col = correlation(old_wave, copy);
    let delay = 0;
    for (let i = 0; i < col.length / 2; i++) {
      if (col[delay].re < col[i].re) delay = i;
    }
    for (let i = 0; i < copy.length; i++) {
      old_wave[i] = copy[(i + delay) % copy.length];
    }
    return delay;
  };

  const onAudioUpdate = () => {
    const wave = analyser.getByteTimeDomainData();
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    let path_data = "";
    const copy: Complex<number>[] = [];
    wave.forEach(e => copy.push(createComplex(e, 0)));
    const delay = getDelay(copy);
    for (let i = 0; i < wave.length / 2; i++) {
      if (isNaN(wave[i + delay] * 0)) continue;
      const x = (i * 2) / (wave.length - 1) * width;
      const y = (wave[i + delay] / 255) * height;
      path_data += `L ${x},${y}`;
    }
    path.setAttribute("d", "M" + path_data.slice(1));
  };

  return { svg, onAudioUpdate };
};
