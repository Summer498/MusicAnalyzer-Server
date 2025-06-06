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
import { MelodyColorController } from "@music-analyzer/controllers";
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
    this.implication = new ImplicationDisplayController()
    this.gravity = new GravityController(gravity_visible);
    this.melody_beep = new MelodyBeepController();
    this.melody_color = new MelodyColorController();
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
  div.style.width = `${100}%`;
  div.style.height = `${100}%`;
  return div;
};

const getH1 = (title: HTMLHeadElement) => {
  const h1 = document.createElement("h1");
  h1.textContent = title.textContent;
  return h1;
};

const getSVGwithTitle = (title: HTMLHeadElement, piano_roll_view: PianoRoll, header_height: number) => {
  const h1 = getH1(title);

  const div = getDiv();
  div.appendChild(h1);

  const html = getHTML();
  html.appendChild(div);

  const foreign_object = getForeignObject(header_height);
  foreign_object.appendChild(html);

  const g = getG(header_height);
  g.innerHTML = piano_roll_view.svg.getHTML();

  const svg = getSVG(header_height);
  svg.appendChild(foreign_object);
  svg.appendChild(g);

  return svg.outerHTML;
};

const getSaveButton = (tune_id: string, title: HTMLHeadElement, piano_roll_view: PianoRoll) => {
  const save_button = document.createElement("input");
  save_button.value = "save analyzed result as SVG (with title)";
  save_button.setAttribute("type", "submit");
  const header_height = 96;
  function handleDownload() {
    const blob = new Blob([getSVGwithTitle(title, piano_roll_view, header_height)], { "type": "text/plain" });
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

const getSaveButtons = (
  title: TitleInfo,
  titleHead: HTMLHeadingElement,
  piano_roll_view: PianoRoll,
) => {
  const tune_id = `${title.mode}-${title.id}`;
  return [
    getSaveButton(tune_id, titleHead, piano_roll_view),
    getRawSaveButton(tune_id, titleHead, piano_roll_view),
  ]
}

const asParent = (node: HTMLElement) => {
  return {
    appendChildren: (...children: (HTMLElement | SVGSVGElement)[]) => {
      children.forEach(e => node.appendChild(e))
    }
  }
}

class ColumnHTML {
  readonly div: HTMLDivElement
  constructor(...children: (HTMLElement | SVGSVGElement)[]) {
    this.div = document.createElement("div");
    this.div.setAttribute("style", `column-count: ${children.length}`);
    children.forEach(e => this.div.appendChild(e));
  }
}

const setupUI = (
  title_info: TitleInfo,
  audio_player: HTMLAudioElement,
  titleHead: HTMLHeadingElement,
  piano_roll_place: HTMLDivElement,
  manager: ApplicationManager,
) => {
  const audio_viewer = createAudioViewer(audio_player, manager.audio_time_mediator);
  const piano_roll_view = new PianoRoll(manager.analyzed, manager.window_size_mediator, !manager.FULL_VIEW)
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
    setCurrentTimeRatio(0.025);
    audio_player.autoplay = false;
  }
  else { audio_player.autoplay = true; }
}

const setIRCount = () => {
  const area = document.getElementById("ir-count");
}

const calcIRMDistribution = (
  hierarchical_melody: SerializedTimeAndAnalyzedMelody[][]
) => {
  const count = hierarchical_melody.map((layer, l) => {
    const first = layer.slice(0)
    const second = layer.slice(1)

    const diff = second.map((_, i) => second[i].note - first[i].note);
    const impl = diff.slice(0);
    const real = diff.slice(1);
    const next = diff.slice(2);

    const dabs = (a: number, b: number) => Math.abs(a) - Math.sign(b)
    const cdir = (a: number, b: number) => Math.sign(a) === Math.sign(b) ? 0 : 1;
    const count: Record<number,
      { count: number } & Record<number, Record<number,
        { count: number } & Record<number, Record<number,
          number>>>>> = {}
    real.forEach((_, i) => {
      const im = impl[i];
      const reAbs = dabs(real[i], impl[i]);
      const reDir = cdir(real[i], impl[i]);
      const neAbs = dabs(next[i], impl[i]);
      const neDir = cdir(next[i], impl[i]);
      count[im] ||= { count: 0, 0: {}, 1: {} };
      count[im].count++;
      count[im][reDir][reAbs] ||= { count: 0, 0: {}, 1: {} };
      count[im][reDir][reAbs].count++;
      count[im][reDir][reAbs][neDir][neAbs] ||= 0;
      count[im][reDir][reAbs][neDir][neAbs]++;
    })
    return count
  })
  console.log(count);
}

const setup = (
  window: Window,
  audio_player: HTMLAudioElement,
  titleHead: HTMLHeadingElement,
  piano_roll_place: HTMLDivElement,
  title: TitleInfo,
) => (raw_analyzed_data: AnalyzedMusicData) => {
  const { roman, hierarchical_melody, melody, } = raw_analyzed_data;

  calcIRMDistribution(hierarchical_melody);

  const { beat_info, d_melodies } = createAnalyzedDataContainer(roman, melody, hierarchical_melody)
  setPianoRollParameters(hierarchical_melody);
  const manager = new ApplicationManager(beat_info, roman, hierarchical_melody, melody, d_melodies);
  setFullView(manager.FULL_VIEW, audio_player);

  setupUI(title, audio_player, titleHead, piano_roll_place, manager);
  setIRCount();
  new EventLoop(manager.audio_time_mediator, audio_player).update();
  getMusicAnalyzerWindow(window, raw_analyzed_data).onresize = _ => manager.window_size_mediator.onUpdate();
  manager.window_size_mediator.onUpdate();
}

const updateTitle = (
  titleHead: HTMLHeadingElement,
  gttm: TitleInfo,
) => {
  titleHead.textContent = gttm.mode ? `[${gttm.mode}] ${gttm.id}` : gttm.id;
  const tune_match = gttm.id.match(/([0-9]+)_[0-9]/);
  const tune_no = tune_match ? Number(tune_match[1]) : Number(gttm.id);
  if (tune_no) {
    const song_data = song_list[tune_no];
    titleHead.innerHTML = `[${gttm.mode || "???"}] ${gttm.id}, ${song_data.author}, <i>"${song_data.title}"</i>`;
  }
};

type DataPromises = [
  Promise<SerializedTimeAndRomanAnalysis[]>,
  Promise<SerializedTimeAndAnalyzedMelody[]>,
  Promise<MusicXML | undefined>,
  Promise<GroupingStructure | undefined>,
  Promise<MetricalStructure | undefined>,
  Promise<ITimeSpanReduction | undefined>,
  Promise<IProlongationalReduction | undefined>,
];

interface I_GTTM_URLs {
  readonly msc: string
  readonly grp: string
  readonly mtr: string
  readonly tsr: string
  readonly pr: string
}

interface I_AnalysisURLs {
  readonly melody: string
  readonly roman: string
}

const keyLength = (obj: object) => Object.keys(obj).length;
const getJSONfromXML = <T extends object>(url: string) => {
  return fetch(url)
    .then(res => res.text())
    .then(e => {
      const parsed = xml_parser.parse(e) as T;
      return keyLength(parsed) ? parsed : undefined;
    })
    .catch(e => { console.error(e); return undefined; });
};
const getJSON = <T extends object>(url: string) => {
  return fetch(url)
    .then(res => res.json() as T)
    .catch(e => { console.error(e); return undefined; });
}

const getVersionedJSON = <Hoge extends { time: Time }>(VersionChecker: {
  checkVersion: (res: { version: string }) => boolean,
  instantiate: (res: { body: Hoge[] }) => { body: Hoge[] }
}) => (url: string) => fetch(url)
  .then(res => res.json() as Promise<{ version: string, body: Hoge[] }>)
  .then(res => {
    if (VersionChecker.checkVersion(res)) { return VersionChecker.instantiate(res) }
    else { throw new Error(`Version check: fault in ${url}`) }
  })
  .catch(e => fetch(`${url}?update`)
    .then(res => res.json() as Promise<{ version: string, body: Hoge[] }>)
    .then(res => VersionChecker.instantiate(res))
  )
  .then(res => res?.body)
  .then(res => res?.map(e => ({ ...e, head: e.time })) as Hoge[])
  .catch(e => { console.error(e); return []; })


const justLoad = (
  analysis_urls: I_AnalysisURLs,
  gttm_urls: I_GTTM_URLs,
) => {
  return [
    getVersionedJSON(SerializedRomanAnalysisData)(analysis_urls.roman),
    getVersionedJSON(SerializedMelodyAnalysisData)(analysis_urls.melody),
    getJSON<MusicXML>(gttm_urls.msc),
    getJSON<GroupingStructure>(gttm_urls.grp),
    getJSON<MetricalStructure>(gttm_urls.mtr),
    getJSON<TimeSpanReduction>(gttm_urls.tsr),
    getJSON<IProlongationalReduction>(gttm_urls.pr),
    /*
    getJSONfromXML<MusicXML>(gttm_urls.msc),
    getJSONfromXML<GroupingStructure>(gttm_urls.grp),
    getJSONfromXML<MetricalStructure>(gttm_urls.mtr),
    getJSONfromXML<ITimeSpanReduction>(gttm_urls.tsr),
    getJSONfromXML<IProlongationalReduction>(gttm_urls.pr),
    */
  ] as DataPromises;
};

type DataContainer = [
  SerializedTimeAndRomanAnalysis[],
  SerializedTimeAndAnalyzedMelody[],
  MusicXML | undefined,
  GroupingStructure | undefined,
  MetricalStructure | undefined,
  ITimeSpanReduction | undefined,
  IProlongationalReduction | undefined,
]

const compoundMusicData = (title: TitleInfo) => (e: DataContainer) => {
  const [roman, read_melody, musicxml, grouping, metric, time_span, prolongation] = e;

  const ts = time_span ? createTimeSpanReduction(time_span).tstree.ts : undefined;
  const pr = (() => {
    try {
      return prolongation ? createProlongationalReduction(prolongation).prtree.pr : undefined;
    } catch (e) {
      return undefined
    }
  })();

  const measure = title.id === "doremi" ? 3.5 : 7;
  const reduction = title.mode === "PR" && pr || title.mode === "TSR" && ts;
  const matrix = ts?.getMatrixOfLayer(ts.getDepthCount() - 1);
  const hierarchical_melody = reduction && matrix && musicxml && getHierarchicalMelody(measure, reduction, matrix, musicxml, roman) || [read_melody];

  const melody = hierarchical_melody[hierarchical_melody.length - 1];
  return new AnalyzedMusicData(
    roman,
    melody,
    hierarchical_melody,
    new GTTMData(grouping, metric, time_span, prolongation,)
  );
};

class GTTM_URLs
  implements I_GTTM_URLs {
  readonly msc: string
  readonly grp: string
  readonly mtr: string
  readonly tsr: string
  readonly pr: string
  constructor(
    title: TitleInfo,
    resources: string,
  ) {
    this.msc = `https://clone-of-gttm-database.vercel.app/api/MSC?tune=${title.id}`;
    this.grp = `https://clone-of-gttm-database.vercel.app/api/GPR?tune=${title.id}`;
    this.mtr = `https://clone-of-gttm-database.vercel.app/api/MPR?tune=${title.id}`;
    this.tsr = `https://clone-of-gttm-database.vercel.app/api/TS?tune=${title.id}`;
    this.pr = `https://clone-of-gttm-database.vercel.app/api/PR?tune=${title.id}`;
    /*
    this.msc = `${resources}/gttm-example/${title.id}/MSC-${title.id}.xml`
    this.grp = `${resources}/gttm-example/${title.id}/GPR-${title.id}.xml`
    this.mtr = `${resources}/gttm-example/${title.id}/MPR-${title.id}.xml`
    this.tsr = `${resources}/gttm-example/${title.id}/TS-${title.id}.xml`
    this.pr = `${resources}/gttm-example/${title.id}/PR-${title.id}.xml`
    */
  }
}

class AnalysisURLs {
  readonly melody: string
  readonly roman: string
  constructor(
    title: TitleInfo,
    resources: string,
  ) {
    this.melody = `${resources}/${title.id}/analyzed/melody/crepe/manalyze.json`
    this.roman = `${resources}/${title.id}/analyzed/chord/roman.json`
  }
}

const loadMusicAnalysis = (
  title: TitleInfo,
  resources: string,
) => {
  const tune_name = encodeURI(title.id)
  return Promise.all(justLoad(new AnalysisURLs(title, resources), new GTTM_URLs(title, resources)))
    .then(compoundMusicData(title));
}

const registerSong = (urls: string[], default_url: string, audio_player: HTMLAudioElement | HTMLVideoElement) => {
  const url = urls.pop();
  if (!url) {
    audio_player.src = default_url
    return;
  }

  audio_player.muted = false;
  audio_player.src = url;
  audio_player.onerror = () => {
    audio_player.muted = true;
    registerSong(urls, default_url, audio_player);
  };
};

const setAudioPlayer = (
  title: TitleInfo,
  resources: string,
  audio_src: string,
  audio_player: HTMLAudioElement | HTMLVideoElement) => {
  const filename = `${resources}/${title.id}/${title.id}`;
  const extensions = ["mp3", "mp4", "wav", "m4a"];
  registerSong(extensions.map(e => `${filename}.${e}`), audio_src, audio_player);
};

declare const audio_player: HTMLAudioElement | HTMLVideoElement;
declare const piano_roll_place: HTMLDivElement;
declare const title: HTMLHeadingElement;
const titleHead = title;

const main = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const title = new TitleInfo(
    urlParams.get("tune") || "",
    urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : "",
  )
  const resources = `/resources`;
  const audio_src = `https://summer498.github.io/MusicAnalyzer-Server/resources/silence.mp3`;

  updateTitle(titleHead, title);
  setAudioPlayer(title, resources, audio_src, audio_player);
  loadMusicAnalysis(title, resources)
    .then(setup(window, audio_player, titleHead, piano_roll_place, title));

};
main();