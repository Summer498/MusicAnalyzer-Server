import { Switcher } from "./abstract-switcher";

export class GravitySwitcher extends Switcher {
  constructor(id: string, label: string) {
    super(id, label);
  };
}

export const gravityController = (
  chord_gravity_switcher: GravitySwitcher,
  scale_gravity_switcher: GravitySwitcher,
) => {
  const gravity_switcher_div = document.createElement("div");
  gravity_switcher_div.id = "gravity-switcher";
  gravity_switcher_div.appendChild(scale_gravity_switcher.body);
  gravity_switcher_div.appendChild(chord_gravity_switcher.body);
  return gravity_switcher_div;
};
