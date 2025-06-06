// index.ts
import { setCurrentTimeRatio, setPianoRollParameters } from "@music-analyzer/view-parameters";
import { createAnalyzedDataContainer } from "@music-analyzer/analyzed-data-container";
import { createAudioViewer } from "@music-analyzer/spectrogram";
import { createPianoRoll } from "@music-analyzer/piano-roll";
import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { PianoRollWidth } from "@music-analyzer/view-parameters";
import { getHierarchicalMelody } from "@music-analyzer/melody-hierarchical-analysis";
import { MusicXML } from "@music-analyzer/musicxml";
import { createAudioReflectableRegistry } from "@music-analyzer/view";
import { NowAt } from "@music-analyzer/view-parameters";
import { createMusicStructureElements } from "@music-analyzer/piano-roll";
import { createWindowReflectableRegistry } from "@music-analyzer/view";
import {
  createDMelodyController,
  createGravityController,
  createHierarchyLevelController,
  createMelodyBeepController,
  createMelodyColorController,
  createTimeRangeController,
  createImplicationDisplayController
} from "@music-analyzer/controllers";
var createControllers = (layer_count, length, gravity_visible) => {
  const div = document.createElement("div");
  div.id = "controllers";
  div.style.marginTop = "20px";
  const d_melody = createDMelodyController();
  const hierarchy = createHierarchyLevelController(layer_count);
  const time_range = createTimeRangeController(length);
  const implication = createImplicationDisplayController();
  const gravity = createGravityController(gravity_visible);
  const melody_beep = createMelodyBeepController();
  const melody_color = createMelodyColorController();
  melody_beep.checkbox.input.checked = true;
  implication.prospective_checkbox.input.checked = false;
  implication.retrospective_checkbox.input.checked = true;
  implication.reconstructed_checkbox.input.checked = true;
  [
    hierarchy,
    time_range,
    implication,
    melody_beep
  ].forEach((e) => div.appendChild(e.view));
  return {
    div,
    d_melody,
    hierarchy,
    time_range,
    implication,
    gravity,
    melody_beep,
    melody_color
  };
};
var createTitleInfo = (id, mode) => ({ id, mode });
var createApplicationManager = (beat_info, romans, hierarchical_melody, melodies, d_melodies) => {
  const NO_CHORD = false;
  const FULL_VIEW = false;
  if (hierarchical_melody.length <= 0) {
    throw new Error(`hierarchical melody length must be more than 0 but it is ${hierarchical_melody.length}`);
  }
  const layer_count = hierarchical_melody.length - 1;
  const length = melodies.length;
  const controller = createControllers(layer_count, length, !NO_CHORD);
  const audio_time_mediator = createAudioReflectableRegistry();
  const window_size_mediator = createWindowReflectableRegistry();
  const controllers = {
    ...controller,
    audio: audio_time_mediator,
    window: window_size_mediator
  };
  const analyzed = createMusicStructureElements(
    beat_info,
    romans,
    hierarchical_melody,
    melodies,
    d_melodies,
    controllers
  );
  return {
    NO_CHORD,
    FULL_VIEW,
    analyzed,
    controller,
    audio_time_mediator,
    window_size_mediator
  };
};
var createEventLoop = (registry, audio_player) => {
  let last_audio_time = Number.MIN_SAFE_INTEGER;
  let old_time = Date.now();
  const fps_element = document.createElement("p");
  fps_element.id = "fps";
  fps_element.textContent = `fps:${0}`;
  document.body.insertAdjacentElement("beforeend", fps_element);
  const audioUpdate = () => {
    const now_at = audio_player.currentTime;
    if (audio_player.paused && now_at === last_audio_time) return;
    last_audio_time = now_at;
    NowAt.set(now_at);
    registry.onUpdate();
  };
  const onUpdate = () => {
    const now = Date.now();
    const fps = Math.floor(1e3 / (now - old_time));
    fps_element.textContent = `fps:${(" " + fps).slice(-3)}`;
    fps_element.style.color = fps < 30 ? "red" : fps < 60 ? "yellow" : "lime";
    old_time = now;
    audioUpdate();
  };
  const update = () => {
    onUpdate();
    requestAnimationFrame(update);
  };
  return { fps_element, registry, audio_player, update, onUpdate, audioUpdate };
};
var getG = (header_height) => {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${0},${header_height || 0})`);
  return g;
};
var getSVG = (header_height) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(PianoRollWidth.get()));
  svg.setAttribute("height", String(PianoRollHeight.get() + (header_height || 0)));
  svg.setAttribute("viewBox", `0 0 ${PianoRollWidth.get()} ${PianoRollHeight.get() + (header_height || 0)}`);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("xml:space", "preserve");
  svg.setAttribute("overflow", "hidden");
  return svg;
};
var getSVGwithoutTitle = (piano_roll_view) => {
  const g = getG();
  g.innerHTML = piano_roll_view.svg.getHTML();
  const svg = getSVG();
  svg.appendChild(g);
  return svg.outerHTML;
};
var getRawSaveButton = (tune_id, title, piano_roll_view) => {
  const save_button = document.createElement("input");
  save_button.value = "save analyzed result as SVG (without title)";
  save_button.setAttribute("type", "submit");
  function handleDownload() {
    const blob = new Blob([getSVGwithoutTitle(piano_roll_view)], { "type": "text/plain" });
    const download_link = document.createElement("a");
    download_link.setAttribute("download", `${tune_id}.svg`);
    download_link.setAttribute("href", window.URL.createObjectURL(blob));
    download_link.click();
  }
  save_button.onclick = (e) => {
    handleDownload();
  };
  return save_button;
};
var getSaveButtons = (title_info, titleHead, piano_roll_view) => {
  const getTitle = () => `${title_info.id}-${title_info.mode}`;
  const save_button = getRawSaveButton(getTitle(), titleHead, piano_roll_view);
  return [save_button];
};
var asParent = (parent) => ({
  appendChildren: (...children) => {
    children.forEach((e) => parent.appendChild(e));
    return parent;
  }
});
var setupUI = (title_info, audio_player, titleHead, piano_roll_place, manager) => {
  const audio_viewer = createAudioViewer(audio_player, manager.audio_time_mediator);
  const piano_roll_view = createPianoRoll(
    manager.analyzed,
    manager.window_size_mediator,
    !manager.FULL_VIEW
  );
  asParent(piano_roll_place).appendChildren(
    ...getSaveButtons(title_info, titleHead, piano_roll_view),
    piano_roll_view.svg,
    audio_player,
    new ColumnHTML(
      manager.controller.div
      //        manager.analyzed.melody.ir_plot_svg
    ).div
  );
};
var setFullView = (FULL_VIEW, audio_player) => {
  if (FULL_VIEW) {
    document.querySelector("#flex-div").classList.add("full-view");
    audio_player.style.position = "absolute";
    audio_player.style.zIndex = "3";
  } else {
    document.querySelector("#flex-div").classList.remove("full-view");
    audio_player.style.position = "relative";
    audio_player.style.zIndex = "0";
  }
};
var onLoad = async (select, titleHead, piano_roll_place, audio_player) => {
  const repo = process.env.REPO_ORIGIN || "https://github.com/Summer498";
  const res_beat_info = await fetch(`${repo}/auditory/resources/groove.wav.beat`);
  const beat_info = await res_beat_info.json();
  const res_roman = await fetch(`${repo}/auditory/resources/groove.wav.roman.json`);
  const roman = await res_roman.json();
  const res_melody = await fetch(`${repo}/auditory/resources/groove.wav.irm.json`);
  const melody = await res_melody.json();
  const midi_response = await fetch("../resources/groove.wav.xml");
  const midi = MusicXML.parse(await midi_response.text());
  setCurrentTimeRatio(1 / 4);
  const { melody_hierarchy, melodies, d_melodies } = getHierarchicalMelody(melody);
  const containers = await createAnalyzedDataContainer(melody_hierarchy, roman, midi);
  const { gttm, tsa, pra } = containers;
  const app_manager = createApplicationManager(beat_info, pra, melody_hierarchy, melodies, d_melodies);
  setPianoRollParameters(app_manager.analyzed.melody.getHierarchicalMelody());
  setFullView(app_manager.FULL_VIEW, audio_player);
  setupUI(createTitleInfo("groove", "TSR"), audio_player, titleHead, piano_roll_place, app_manager);
  const registry = app_manager.audio_time_mediator;
  const event_loop = createEventLoop(registry, audio_player);
  event_loop.update();
};
export {
  onLoad
};
