import { Complex } from "@music-analyzer/math";
import { correlation } from "@music-analyzer/math";
import { AudioReflectable } from "@music-analyzer/view";
import { AudioAnalyzer } from "./audio-analyzer";

export class WaveViewer 
  implements AudioReflectable {
  private readonly path: SVGPathElement;
  private old_wave: Complex<number>[];
  readonly svg: SVGSVGElement;
  constructor(
    private readonly analyser: AudioAnalyzer,
  ) {
    this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.path.setAttribute("stroke", "blue");
    this.path.setAttribute("fill", "none");
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.appendChild(this.path);
    this.svg.id = "sound-wave";
    this.svg.setAttribute("width", String(800));
    this.svg.setAttribute("height", String(450));
    this.old_wave = [... new Array(analyser.analyser.fftSize)].map(e => new Complex(0, 0));
  }

  private getDelay(copy:Complex<number>[]){
    const col = correlation(this.old_wave, copy);

    let delay = 0;
    for (let i = 0; i < col.length / 2; i++) {
      if (col[delay].re < col[i].re) {
        delay = i;
      }
    }
    for (let i = 0; i < copy.length; i++) {
      this.old_wave[i] = copy[(i + delay) % copy.length];
    }
    return delay;    
  }

  onAudioUpdate() {
    const wave = this.analyser.getByteTimeDomainData();
    const width = this.svg.clientWidth;
    const height = this.svg.clientHeight;
    let path_data = "";

    const copy: Complex<number>[] = [];
    wave.forEach(e => { copy.push(new Complex(e, 0)); });
    const delay = this.getDelay(copy);

    for (let i = 0; i < wave.length / 2; i++) {
      if (isNaN(wave[i + delay] * 0)) { continue; }
      const x = i * 2 / (wave.length - 1) * width;
      // データは [0,255] なので, 中心を height/2 として正規化
      const y = wave[i + delay] / 255 * height;
      path_data += `L ${x},${y}`;
    }
    this.path.setAttribute("d", "M" + path_data.slice(1));
  }
}
