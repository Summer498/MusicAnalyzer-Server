import { AccompanyToAudioRegistry } from "@music-analyzer/view";
import { Controller } from "./controller";

export class MelodyBeepVolume implements Controller {
  readonly body: HTMLSpanElement;
  readonly range: HTMLInputElement;
  constructor() {
    this.range = document.createElement("input");
    this.range.type = "range";
    this.range.id = "melody_beep_volume";
    this.range.min = String(0);
    this.range.max = String(100);
    this.range.step = String(1);
    const show_melody_beep_volume = document.createElement("span");
    show_melody_beep_volume.textContent = `volume: ${this.range.value}`;
    this.range.addEventListener("input", e => {
      show_melody_beep_volume.textContent = `volume: ${this.range.value}`;
      AccompanyToAudioRegistry.instance.onAudioUpdate();
    });
    this.body = document.createElement("span");
    this.body.appendChild(this.range);
    this.body.appendChild(show_melody_beep_volume);
  };
}

