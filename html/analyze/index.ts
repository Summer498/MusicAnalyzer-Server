import { setCurrentTimeRatio, setPianoRollParameters } from "@music-analyzer/view-parameters";
import { song_list } from "@music-analyzer/gttm";
import { createAnalyzedDataContainer } from "@music-analyzer/analyzed-data-container";
import { createAudioViewer } from "@music-analyzer/spectrogram";
import { PianoRoll } from "@music-analyzer/piano-roll";
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
import { MusicStructureElements } from "@music-analyzer/piano-roll";
import { WindowReflectableRegistry, createWindowReflectableRegistry } from "@music-analyzer/view";
import { BeatInfo } from "@music-analyzer/beat-estimation";
import { DMelodyController } from "@music-analyzer/controllers";
import { GravityController } from "@music-analyzer/controllers";
import { HierarchyLevelController } from "@music-analyzer/controllers";
import { MelodyBeepController } from "@music-analyzer/controllers";
import { MelodyColorController, createMelodyColorController } from "@music-analyzer/controllers";
import { TimeRangeController } from "@music-analyzer/controllers";
import { Time } from "@music-analyzer/time-and";
import { ImplicationDisplayController } from "@music-analyzer/controllers/src/switcher";

class Controllers {
  readonly div: HTMLDivElement
  readonly d_melody: DMelodyController
  readonly hierarchy: HierarchyLevelController
  readonly time_range: TimeRangeController
  readonly implication: ImplicationDisplayController
  readonly gravity: GravityController
  readonly melody_beep: MelodyBeepController
  readonly melody_color: MelodyColorController

  constructor(
    layer_count: number,
    length: number,
    gravity_visible: boolean,
  ) {
    this.div = document.createElement("div");
    this.div.id = "controllers";
    this.div.style = "margin-top:20px";

    this.d_melody = new DMelodyController();
    this.hierarchy = new HierarchyLevelController(layer_count);
    this.time_range = new TimeRangeController(length);
    this.implication = new ImplicationDisplayController();
    this.gravity = new GravityController(gravity_visible);
    this.melody_beep = new MelodyBeepController();
    this.melody_color = createMelodyColorController();
    this.melody_beep.checkbox.input.checked=true;
    this.implication.prospective_checkbox.input.checked = false;
    this.implication.retrospective_checkbox.input.checked = true;
    this.implication.reconstructed_checkbox.input.checked = true;

    [
//      this.d_melody,
      this.hierarchy,
      this.time_range,
      this.implication,
//      this.gravity,
      this.melody_beep,
//      this.melody_color,
    ].forEach(e => this.div.appendChild(e.view))
  }
}

type Mode = "TSR" | "PR" | "";

class TitleInfo {
  constructor(
    readonly id: string,
    readonly mode: Mode,
  ) { }
}

class AnalyzedMusicData {
  constructor(
    readonly roman: SerializedTimeAndRomanAnalysis[],
    readonly melody: SerializedTimeAndAnalyzedMelody[],
    readonly hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
    readonly GTTM: GTTMData,
  ) { }
}

interface MusicAnalyzerWindow
  extends Window {
  MusicAnalyzer: AnalyzedMusicData
}

const getMusicAnalyzerWindow = (window: Window, raw_analyzed_data: AnalyzedMusicData) => {
  const e = window as MusicAnalyzerWindow;
  e.MusicAnalyzer = raw_analyzed_data;
  return e;
}

class ApplicationManager {
  readonly NO_CHORD = false;  // コード関連のものを表示しない
  readonly FULL_VIEW = false;  // 横いっぱいに分析結果を表示
  readonly analyzed: MusicStructureElements
  readonly controller: Controllers
  readonly audio_time_mediator: AudioReflectableRegistry
  readonly window_size_mediator: WindowReflectableRegistry
  constructor(
    beat_info: BeatInfo,
    romans: SerializedTimeAndRomanAnalysis[],
    hierarchical_melody: SerializedTimeAndAnalyzedMelody[][],
    melodies: SerializedTimeAndAnalyzedMelody[],
    d_melodies: SerializedTimeAndAnalyzedMelody[],
  ) {
    if (hierarchical_melody.length <= 0) {
      throw new Error(`hierarchical melody length must be more than 0 but it is ${hierarchical_melody.length}`);
    }

    const layer_count = hierarchical_melody.length - 1;
    const length = melodies.length

    this.controller = new Controllers(layer_count, length, !this.NO_CHORD);
    this.audio_time_mediator = createAudioReflectableRegistry();
    this.window_size_mediator = createWindowReflectableRegistry();
    const controllers = {
      ...this.controller,
      audio: this.audio_time_mediator,
      window: this.window_size_mediator,
    }

    this.analyzed = new MusicStructureElements(beat_info, romans, hierarchical_melody, melodies, d_melodies, controllers)
  }
}

class EventLoop {
  readonly fps_element: HTMLParagraphElement;
  private last_audio_time = Number.MIN_SAFE_INTEGER;
  private old_time: number;
  constructor(
    public readonly registry: AudioReflectableRegistry,
    public readonly audio_player: HTMLAudioElement | HTMLVideoElement,
  ) {
    this.old_time = Date.now();
    this.fps_element = document.createElement("p");
    this.fps_element.id = "fps";
    this.fps_element.textContent = `fps:${0}`;
    document.body.insertAdjacentElement("beforeend", this.fps_element);
  }
  audioUpdate() {
    const now_at = this.audio_player.currentTime;
    if (this.audio_player.paused && now_at === this.last_audio_time) { return; }
    this.last_audio_time = now_at;
    NowAt.set(now_at);
    this.registry.onUpdate();
  };
  onUpdate() {
    const now = Date.now();
    const fps = Math.floor(1000 / (now - this.old_time));
    this.fps_element.textContent = `fps:${(" " + fps).slice(-3)}`;
    this.fps_element.style.color = fps < 30 ? "red" : fps < 60 ? "yellow" : "lime";
    this.old_time = now;

    this.audioUpdate();
  };
  update() {
    this.onUpdate();
    requestAnimationFrame(this.update.bind(this));
  }
}

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
  const piano_roll_view = new PianoRoll(manager.analyzed, manager.window_size_mediator, !manager.FULL_VIEW);
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
  const app_manager = new ApplicationManager(beat_info, pra, melody_hierarchy, melodies, d_melodies);
  setPianoRollParameters(app_manager.analyzed.melody.getHierarchicalMelody());
  setFullView(app_manager.FULL_VIEW, audio_player);
  setupUI(new TitleInfo("groove", "TSR"), audio_player, titleHead, piano_roll_place, app_manager);
  const registry = app_manager.audio_time_mediator;
  const event_loop = new EventLoop(registry, audio_player);
  event_loop.update();
};
