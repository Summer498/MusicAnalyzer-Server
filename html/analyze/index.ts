import { setCurrentTimeRatio, setPianoRollParameters } from "@music-analyzer/view-parameters";
import { song_list } from "@music-analyzer/gttm";
import { createAnalyzedDataContainer } from "@music-analyzer/analyzed-data-container";
import { createAudioViewer } from "@music-analyzer/spectrogram";
import type { PianoRoll } from "@music-analyzer/piano-roll";
import { createPianoRoll } from "@music-analyzer/piano-roll";
import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { PianoRollWidth } from "@music-analyzer/view-parameters";
import { GTTMData } from "@music-analyzer/gttm";
import { createProlongationalReduction } from "@music-analyzer/gttm";
import { createTimeSpanReduction } from "@music-analyzer/gttm";
import { getHierarchicalMelody } from "@music-analyzer/melody-hierarchical-analysis";
import { SerializedTimeAndRomanAnalysis } from "@music-analyzer/chord-analyze";
import { GroupingStructure } from "@music-analyzer/gttm";
import { IProlongationalReduction } from "@music-analyzer/gttm";
import { ITimeSpanReduction } from "@music-analyzer/gttm";
import { MetricalStructure } from "@music-analyzer/gttm";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { MusicXML } from "@music-analyzer/musicxml";
import { SerializedRomanAnalysisData } from "@music-analyzer/chord-analyze";
import { SerializedMelodyAnalysisData } from "@music-analyzer/melody-analyze";
import { xml_parser } from "@music-analyzer/serializable-data";
import { AudioReflectableRegistry, createAudioReflectableRegistry } from "@music-analyzer/view";
import { NowAt } from "@music-analyzer/view-parameters";
import type { MusicStructureElements } from "@music-analyzer/piano-roll";
import { createMusicStructureElements } from "@music-analyzer/piano-roll";
import { WindowReflectableRegistry, createWindowReflectableRegistry } from "@music-analyzer/view";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import type {
  DMelodyController,
  GravityController,
  HierarchyLevelController,
  MelodyBeepController,
  MelodyColorController,
  TimeRangeController,
  ImplicationDisplayController,
} from "@music-analyzer/controllers";
import {
  createDMelodyController,
  createGravityController,
  createHierarchyLevelController,
  createMelodyBeepController,
  createMelodyColorController,
  createTimeRangeController,
  createImplicationDisplayController,
} from "@music-analyzer/controllers";
import { Time } from "@music-analyzer/time-and";

interface Controllers {
  readonly div: HTMLDivElement
  readonly d_melody: DMelodyController
  readonly hierarchy: HierarchyLevelController
  readonly time_range: TimeRangeController
  readonly implication: ImplicationDisplayController
  readonly gravity: GravityController
  readonly melody_beep: MelodyBeepController
  readonly melody_color: MelodyColorController
}

const createControllers = (
  layer_count: number,
  length: number,
  gravity_visible: boolean,
): Controllers => {
  const div = document.createElement("div");
  div.id = "controllers";
  div.style.marginTop = "20px";

  const d_melody = new DMelodyController();
  const hierarchy = new HierarchyLevelController(layer_count);
  const time_range = new TimeRangeController(length);
  const implication = new ImplicationDisplayController();
  const gravity = new GravityController(gravity_visible);
  const melody_beep = new MelodyBeepController();
  const melody_color = createMelodyColorController();

  melody_beep.checkbox.input.checked = true;
  implication.prospective_checkbox.input.checked = false;
  implication.retrospective_checkbox.input.checked = true;
  implication.reconstructed_checkbox.input.checked = true;

  [
    hierarchy,
    time_range,
    implication,
    melody_beep,
  ].forEach((e) => div.appendChild(e.view));

  return {
    div,
    d_melody,
    hierarchy,
    time_range,
    implication,
    gravity,
    melody_beep,
    melody_color,
  };
};

type Mode = "TSR" | "PR" | "";

interface TitleInfo {
  readonly id: string
  readonly mode: Mode
}

const createTitleInfo = (id: string, mode: Mode): TitleInfo => ({ id, mode });

interface AnalyzedMusicData {
  readonly roman: SerializedTimeAndRomanAnalysis[]
  readonly melody: SerializedTimeAndAnalyzedMelody[]
  readonly hierarchical_melody: SerializedTimeAndAnalyzedMelody[][]
  readonly GTTM: GTTMData
}

const createAnalyzedMusicData = (
  roman: SerializedTimeAndRomanAnalysis[],
  melody: SerializedTimeAndAnalyzedMelody[],
  hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
  GTTM: GTTMData,
): AnalyzedMusicData => ({ roman, melody, hierarchical_melody, GTTM });

interface MusicAnalyzerWindow
  extends Window {
  MusicAnalyzer: AnalyzedMusicData
}

const getMusicAnalyzerWindow = (window: Window, raw_analyzed_data: AnalyzedMusicData) => {
  const e = window as MusicAnalyzerWindow;
  e.MusicAnalyzer = raw_analyzed_data;
  return e;
}

interface ApplicationManager {
  readonly NO_CHORD: boolean
  readonly FULL_VIEW: boolean
  readonly analyzed: MusicStructureElements
  readonly controller: Controllers
  readonly audio_time_mediator: AudioReflectableRegistry
  readonly window_size_mediator: WindowReflectableRegistry
}

const createApplicationManager = (
  beat_info: BeatInfo,
  romans: SerializedTimeAndRomanAnalysis[],
  hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
  melodies: SerializedTimeAndAnalyzedMelody[],
  d_melodies: SerializedTimeAndAnalyzedMelody[],
): ApplicationManager => {
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
    window: window_size_mediator,
  };

  const analyzed = new MusicStructureElements(
    beat_info,
    romans,
    hierarchical_melody,
    melodies,
    d_melodies,
    controllers,
  );

  return {
    NO_CHORD,
    FULL_VIEW,
    analyzed,
    controller,
    audio_time_mediator,
    window_size_mediator,
  };
};

interface EventLoop {
  readonly fps_element: HTMLParagraphElement
  readonly registry: AudioReflectableRegistry
  readonly audio_player: HTMLAudioElement | HTMLVideoElement
  update(): void
  onUpdate(): void
  audioUpdate(): void
}

const createEventLoop = (
  registry: AudioReflectableRegistry,
  audio_player: HTMLAudioElement | HTMLVideoElement,
): EventLoop => {
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
    const fps = Math.floor(1000 / (now - old_time));
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

const getG = (header_height?: number) => {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("transform", `translate(${0},${header_height || 0})`);
  return g;
};

const getSVG = (header_height?: number) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(PianoRollWidth.get()));
  svg.setAttribute("height", String(PianoRollHeight.get() + (header_height || 0)));
  svg.setAttribute("viewBox", `0 0 ${PianoRollWidth.get()} ${PianoRollHeight.get() + (header_height || 0)}`);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("xml:space", "preserve");
  svg.setAttribute("overflow", "hidden");
  return svg;
};

const getSVGwithoutTitle = (piano_roll_view: PianoRoll) => {
  const g = getG();
  g.innerHTML = piano_roll_view.svg.getHTML();

  const svg = getSVG();
  svg.appendChild(g);
  return svg.outerHTML;
};

const getRawSaveButton = (tune_id: string, title: HTMLHeadElement, piano_roll_view: PianoRoll) => {
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
  save_button.onclick = e => {
    handleDownload();
  };
  return save_button;
};

const getForeignObject = (header_height: number) => {
  const foreign_object = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreign_object.setAttribute("x", "0");
  foreign_object.setAttribute("y", "0");
  foreign_object.setAttribute("width", String(PianoRollWidth.get()));
  foreign_object.setAttribute("height", String(header_height));
  return foreign_object;
};

const getHTML = () => {
  const html = document.createElement("html");
  html.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  return html;
};

const getDiv = () => {
  const div = document.createElement("div");
  div.style.backgroundColor = "white";
  return div;
};

const getSaveButtons = (
  title_info: TitleInfo,
  titleHead: HTMLHeadingElement,
  piano_roll_view: PianoRoll,
) => {
  const getTitle = () => `${title_info.id}-${title_info.mode}`;
  const save_button = getRawSaveButton(getTitle(), titleHead, piano_roll_view);
  return [save_button];
};

const asParent = (parent: HTMLElement) => ({
  appendChildren: (...children: HTMLElement[]) => { children.forEach(e => parent.appendChild(e)); return parent; },
});

const setupUI = (
  title_info: TitleInfo,
  audio_player: HTMLAudioElement,
  titleHead: HTMLHeadingElement,
  piano_roll_place: HTMLDivElement,
  manager: ApplicationManager,
) => {
  const audio_viewer = createAudioViewer(audio_player, manager.audio_time_mediator);
  const piano_roll_view = createPianoRoll(
    manager.analyzed,
    manager.window_size_mediator,
    !manager.FULL_VIEW,
  );
  asParent(piano_roll_place)
    .appendChildren(
      /*
      new ColumnHTML(
        audio_viewer.wave.svg,
        audio_viewer.spectrogram.svg,
        audio_viewer.fft.svg,
      ).div,
      */
      ...getSaveButtons(title_info, titleHead, piano_roll_view),
      piano_roll_view.svg,
      audio_player,
      new ColumnHTML(
        manager.controller.div,
//        manager.analyzed.melody.ir_plot_svg
      ).div,
    )
};


const setFullView = (
  FULL_VIEW: boolean,
  audio_player: HTMLAudioElement,
) => {
  if (FULL_VIEW) {
    document.querySelector("#flex-div")!.classList.add("full-view");
    audio_player.style.position = "absolute";
    audio_player.style.zIndex = "3";
  } else {
    document.querySelector("#flex-div")!.classList.remove("full-view");
    audio_player.style.position = "relative";
    audio_player.style.zIndex = "0";
  }
};

export const onLoad = async (
  select: HTMLSelectElement,
  titleHead: HTMLHeadingElement,
  piano_roll_place: HTMLDivElement,
  audio_player: HTMLAudioElement,
) => {
  const repo = process.env.REPO_ORIGIN || "https://github.com/Summer498";
  const res_beat_info = await fetch(`${repo}/auditory/resources/groove.wav.beat`);
  const beat_info: BeatInfo = await res_beat_info.json();
  const res_roman = await fetch(`${repo}/auditory/resources/groove.wav.roman.json`);
  const roman = await res_roman.json() as SerializedTimeAndRomanAnalysis[];
  const res_melody = await fetch(`${repo}/auditory/resources/groove.wav.irm.json`);
  const melody = await res_melody.json() as SerializedMelodyAnalysisData;
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
