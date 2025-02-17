import { ControllerUIs } from "../controller-uis";

export const setupControllers = (controller: ControllerUIs, NO_CHORD: boolean) => {
  const d_melody = controller.d_melody_controller;
  const hierarchy_level = controller.hierarchy_controller;
  const time_length = controller.time_range_controller;
  const gravity_switcher = controller.gravity_controller;
  const melody_beep_controllers = controller.melody_beep_controller;
  const melody_color_selector = controller.melody_color_controller;

  const controllers = document.createElement("div");
  controllers.id = "controllers";
  controllers.style = "margin-top:20px";
  controllers.appendChild(d_melody.view);
  controllers.appendChild(hierarchy_level.view);
  controllers.appendChild(time_length.view);
  if (!NO_CHORD) {
    controllers.appendChild(gravity_switcher.view);
  }
  controllers.appendChild(melody_beep_controllers.view);
  controllers.appendChild(melody_color_selector.view);  // NOTE: 色選択は未実装なので消しておく
  return controllers;
};
