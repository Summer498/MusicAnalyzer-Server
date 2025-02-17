import { Switcher } from "./abstract-switcher";

export class DMelodySwitcher extends Switcher {
  constructor(id: string, label: string) {
    super(id, label);
  }
}

export const dMelody = (d_melody_switcher: DMelodySwitcher) => {
  const d_melody_div = document.createElement("div");
  d_melody_div.id = "d-melody";
  d_melody_div.appendChild(d_melody_switcher.body);
  return d_melody_div;
};
