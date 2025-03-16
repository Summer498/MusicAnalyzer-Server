import { Dyad, Monad, Null_ad, Triad } from "@music-analyzer/irm";
import { MelodyColorSelector } from "./melody-color-selector";

type hasArchetype = { archetype: Triad | Dyad | Monad | Null_ad }
type ColorChangeSubscriber = {
  setColor: (getColor: (e: hasArchetype) => string) => void
  updateColor: () => void
}

export class MelodyColorController {
  readonly view: HTMLDivElement;
  readonly selector: MelodyColorSelector;
  constructor() {
    this.selector = new MelodyColorSelector();
    this.view = document.createElement("div");
    this.view.id = "melody-color-selector";
    this.view.style.display = "inline";
    this.view.appendChild(this.selector.body);
  }
  readonly subscribers: ColorChangeSubscriber[] = [];
  register(...subscribers: ColorChangeSubscriber[]) {
    this.subscribers.push(...subscribers);
  }
  _update(getColor: (e: hasArchetype) => string) {
    return () => {
      this.subscribers.forEach(e => e.setColor(getColor));
    };
  }
}
