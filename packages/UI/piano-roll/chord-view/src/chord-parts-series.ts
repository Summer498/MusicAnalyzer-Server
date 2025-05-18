import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";
import { Time } from "@music-analyzer/time-and";
import { TimeRangeController } from "@music-analyzer/controllers";

export abstract class ChordPartSeries
  <T extends {
    readonly svg: SVGElement
    readonly model: { readonly time: Time };
    onWindowResized: () => void
    onTimeRangeChanged: () => void
  }> {
  readonly svg: SVGGElement
  readonly children_model: { readonly time: Time }[];
  #show: T[];
  get show() { return this.#show; };

  constructor(
    id: string,
    controllers: {
      readonly audio: AudioReflectableRegistry
      readonly window: WindowReflectableRegistry,
      readonly time_range: TimeRangeController,
    },
    readonly children: T[],
  ) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svg.id = id;
    children.forEach(e => svg.appendChild(e.svg));
    
    controllers.audio.addListeners(this.onAudioUpdate.bind(this));
    controllers.window.addListeners(this.onWindowResized.bind(this));
    controllers.time_range.addListeners(this.onTimeRangeChanged.bind(this));
    
    this.svg = svg;
    this.children_model = children.map(e => e.model);
    this.#show = children;
  }
  onTimeRangeChanged() { this.children.forEach(e => e.onTimeRangeChanged()) }
  onWindowResized() { this.children.forEach(e => e.onWindowResized()) }
  onAudioUpdate() { this.svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }
}
