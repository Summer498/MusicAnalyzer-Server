import { DMelodySwitcher } from "@music-analyzer/controllers";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { DMelodyController } from "./d-melody-controller";
import { SvgCollection } from "@music-analyzer/view";

export const getDMelodyControllers = (detected_melodies: IMelodyModel[], d_melody_switcher: DMelodySwitcher) =>
  new SvgCollection(
    "detected-melody",
    detected_melodies.map(e => new DMelodyController(e, d_melody_switcher))
  );
