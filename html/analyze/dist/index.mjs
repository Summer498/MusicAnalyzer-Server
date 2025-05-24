// index.ts
import { setCurrentTimeRatio, setPianoRollParameters } from "@music-analyzer/view-parameters";
import { song_list } from "@music-analyzer/gttm";
import { AnalyzedDataContainer } from "@music-analyzer/analyzed-data-container";
import { AudioViewer } from "@music-analyzer/spectrogram";
import { PianoRoll } from "@music-analyzer/piano-roll";
import { PianoRollHeight } from "@music-analyzer/view-parameters";
import { PianoRollWidth } from "@music-analyzer/view-parameters";
import { GTTMData } from "@music-analyzer/gttm";
import { ProlongationalReduction } from "@music-analyzer/gttm";
import { TimeSpanReduction } from "@music-analyzer/gttm";
import { getHierarchicalMelody } from "@music-analyzer/melody-hierarchical-analysis";
import { SerializedRomanAnalysisData } from "@music-analyzer/chord-analyze";
import { SerializedMelodyAnalysisData } from "@music-analyzer/melody-analyze";
import { xml_parser } from "@music-analyzer/serializable-data";
import { AudioReflectableRegistry } from "@music-analyzer/view";
import { NowAt } from "@music-analyzer/view-parameters";
import { MusicStructureElements } from "@music-analyzer/piano-roll";
import { WindowReflectableRegistry } from "@music-analyzer/view";
import { DMelodyController } from "@music-analyzer/controllers";
import { GravityController } from "@music-analyzer/controllers";
import { HierarchyLevelController } from "@music-analyzer/controllers";
import { MelodyBeepController } from "@music-analyzer/controllers";
import { MelodyColorController } from "@music-analyzer/controllers";
import { TimeRangeController } from "@music-analyzer/controllers";
var Controllers = class {
  div;
  d_melody;
  hierarchy;
  time_range;
  gravity;
  melody_beep;
  melody_color;
  constructor(layer_count, length, gravity_visible) {
    this.div = document.createElement("div");
    this.div.id = "controllers";
    this.div.style = "margin-top:20px";
    this.d_melody = new DMelodyController();
    this.hierarchy = new HierarchyLevelController(layer_count);
    this.time_range = new TimeRangeController(length);
    this.gravity = new GravityController(gravity_visible);
    this.melody_beep = new MelodyBeepController();
    this.melody_color = new MelodyColorController();
    [
      this.d_melody,
      this.hierarchy,
      this.time_range,
      this.gravity,
      this.melody_beep,
      this.melody_color
    ].forEach((e) => this.div.appendChild(e.view));
  }
};
var TitleInfo = class {
  constructor(id, mode) {
    this.id = id;
    this.mode = mode;
  }
};
var AnalyzedMusicData = class {
  constructor(roman, melody, hierarchical_melody, GTTM) {
    this.roman = roman;
    this.melody = melody;
    this.hierarchical_melody = hierarchical_melody;
    this.GTTM = GTTM;
  }
};
var getMusicAnalyzerWindow = (window2, raw_analyzed_data) => {
  const e = window2;
  e.MusicAnalyzer = raw_analyzed_data;
  return e;
};
var ApplicationManager = class {
  NO_CHORD = false;
  // コード関連のものを表示しない
  FULL_VIEW = true;
  // 横いっぱいに分析結果を表示
  analyzed;
  controller;
  audio_time_mediator;
  window_size_mediator;
  constructor(beat_info, romans, hierarchical_melody, melodies, d_melodies) {
    if (hierarchical_melody.length <= 0) {
      throw new Error(`hierarchical melody length must be more than 0 but it is ${hierarchical_melody.length}`);
    }
    const layer_count = hierarchical_melody.length - 1;
    const length = melodies.length;
    this.controller = new Controllers(layer_count, length, !this.NO_CHORD);
    this.audio_time_mediator = new AudioReflectableRegistry();
    this.window_size_mediator = new WindowReflectableRegistry();
    const controllers = {
      ...this.controller,
      audio: this.audio_time_mediator,
      window: this.window_size_mediator
    };
    this.analyzed = new MusicStructureElements(beat_info, romans, hierarchical_melody, melodies, d_melodies, controllers);
  }
};
var EventLoop = class {
  constructor(registry, audio_player2) {
    this.registry = registry;
    this.audio_player = audio_player2;
    this.old_time = Date.now();
    this.fps_element = document.createElement("p");
    this.fps_element.id = "fps";
    this.fps_element.textContent = `fps:${0}`;
    document.body.insertAdjacentElement("beforeend", this.fps_element);
  }
  fps_element;
  last_audio_time = Number.MIN_SAFE_INTEGER;
  old_time;
  audioUpdate() {
    const now_at = this.audio_player.currentTime;
    if (this.audio_player.paused && now_at === this.last_audio_time) {
      return;
    }
    this.last_audio_time = now_at;
    NowAt.set(now_at);
    this.registry.onUpdate();
  }
  onUpdate() {
    const now = Date.now();
    const fps = Math.floor(1e3 / (now - this.old_time));
    this.fps_element.textContent = `fps:${(" " + fps).slice(-3)}`;
    this.fps_element.style.color = fps < 30 ? "red" : fps < 60 ? "yellow" : "lime";
    this.old_time = now;
    this.audioUpdate();
  }
  update() {
    this.onUpdate();
    requestAnimationFrame(this.update.bind(this));
  }
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
var getRawSaveButton = (tune_id, title2, piano_roll_view) => {
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
var getForeignObject = (header_height) => {
  const foreign_object = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreign_object.setAttribute("x", "0");
  foreign_object.setAttribute("y", "0");
  foreign_object.setAttribute("width", String(PianoRollWidth.get()));
  foreign_object.setAttribute("height", String(header_height));
  return foreign_object;
};
var getHTML = () => {
  const html = document.createElement("html");
  html.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  return html;
};
var getDiv = () => {
  const div = document.createElement("div");
  div.style.backgroundColor = "white";
  div.style.width = `${100}%`;
  div.style.height = `${100}%`;
  return div;
};
var getH1 = (title2) => {
  const h1 = document.createElement("h1");
  h1.textContent = title2.textContent;
  return h1;
};
var getSVGwithTitle = (title2, piano_roll_view, header_height) => {
  const h1 = getH1(title2);
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
var getSaveButton = (tune_id, title2, piano_roll_view) => {
  const save_button = document.createElement("input");
  save_button.value = "save analyzed result as SVG (with title)";
  save_button.setAttribute("type", "submit");
  const header_height = 96;
  function handleDownload() {
    const blob = new Blob([getSVGwithTitle(title2, piano_roll_view, header_height)], { "type": "text/plain" });
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
var getSaveButtons = (title2, titleHead2, piano_roll_view) => {
  const tune_id = `${title2.mode}-${title2.id}`;
  return [
    getSaveButton(tune_id, titleHead2, piano_roll_view),
    getRawSaveButton(tune_id, titleHead2, piano_roll_view)
  ];
};
var asParent = (node) => {
  return {
    appendChildren: (...children) => {
      children.forEach((e) => node.appendChild(e));
    }
  };
};
var ColumnHTML = class {
  div;
  constructor(...children) {
    this.div = document.createElement("div");
    this.div.setAttribute("style", `column-count: ${children.length}`);
    children.forEach((e) => this.div.appendChild(e));
  }
};
var setupUI = (title_info, audio_player2, titleHead2, piano_roll_place2, manager) => {
  const audio_viewer = new AudioViewer(audio_player2, manager.audio_time_mediator);
  const piano_roll_view = new PianoRoll(manager.analyzed, manager.window_size_mediator, !manager.FULL_VIEW);
  asParent(piano_roll_place2).appendChildren(
    new ColumnHTML(
      audio_viewer.wave.svg,
      audio_viewer.spectrogram.svg,
      audio_viewer.fft.svg
    ).div,
    ...getSaveButtons(title_info, titleHead2, piano_roll_view),
    piano_roll_view.svg,
    audio_player2,
    new ColumnHTML(
      manager.controller.div,
      manager.analyzed.melody.ir_plot_svg
    ).div
  );
};
var setFullView = (FULL_VIEW, audio_player2) => {
  if (FULL_VIEW) {
    setCurrentTimeRatio(0.025);
    audio_player2.autoplay = false;
  } else {
    audio_player2.autoplay = true;
  }
};
var setIRCount = () => {
  const area = document.getElementById("ir-count");
};
var setup = (window2, audio_player2, titleHead2, piano_roll_place2, title2) => (raw_analyzed_data) => {
  const { roman, hierarchical_melody, melody } = raw_analyzed_data;
  const { beat_info, d_melodies } = new AnalyzedDataContainer(roman, melody, hierarchical_melody);
  setPianoRollParameters(hierarchical_melody);
  const manager = new ApplicationManager(beat_info, roman, hierarchical_melody, melody, d_melodies);
  setFullView(manager.FULL_VIEW, audio_player2);
  setupUI(title2, audio_player2, titleHead2, piano_roll_place2, manager);
  setIRCount();
  new EventLoop(manager.audio_time_mediator, audio_player2).update();
  getMusicAnalyzerWindow(window2, raw_analyzed_data).onresize = (_) => manager.window_size_mediator.onUpdate();
  manager.window_size_mediator.onUpdate();
};
var updateTitle = (titleHead2, gttm) => {
  titleHead2.textContent = gttm.mode ? `[${gttm.mode}] ${gttm.id}` : gttm.id;
  const tune_match = gttm.id.match(/([0-9]+)_[0-9]/);
  const tune_no = tune_match ? Number(tune_match[1]) : Number(gttm.id);
  if (tune_no) {
    const song_data = song_list[tune_no];
    titleHead2.innerHTML = `[${gttm.mode || "???"}] ${gttm.id}, ${song_data.author}, <i>"${song_data.title}"</i>`;
  }
};
var getJSON = (url) => {
  return fetch(url).then((res) => res.json()).catch((e) => {
    console.error(e);
    return void 0;
  });
};
var justLoad = (analysis_urls, gttm_urls) => {
  return [
    fetch(analysis_urls.roman).then((res) => res.json()).then((res) => {
      if (SerializedRomanAnalysisData.checkVersion(res)) {
        return SerializedRomanAnalysisData.instantiate(res);
      } else {
        throw new Error(`Version check: fault in RomanAnalysisData`);
      }
    }).catch(
      (e) => fetch(`${analysis_urls.roman}?update`).then((res) => res.json()).then((res) => SerializedRomanAnalysisData.instantiate(res))
    ).then((res) => res?.body).catch((e) => {
      console.error(e);
      return [];
    }),
    fetch(analysis_urls.melody).then((res) => res.json()).then((res) => {
      if (SerializedMelodyAnalysisData.checkVersion(res)) {
        return SerializedMelodyAnalysisData.instantiate(res);
      } else {
        throw new Error(`Version check: fault in MelodyAnalysisData`);
      }
    }).catch(
      (e) => fetch(`${analysis_urls.melody}?update`).then((res) => res.json()).then((res) => SerializedMelodyAnalysisData.instantiate(res))
    ).then((res) => res?.body).then((res) => res?.map((e) => ({ ...e, head: e.time }))).catch((e) => {
      console.error(e);
      return [];
    }),
    getJSON(gttm_urls.msc),
    getJSON(gttm_urls.grp),
    getJSON(gttm_urls.mtr),
    getJSON(gttm_urls.tsr),
    getJSON(gttm_urls.pr)
    /*
    getJSONfromXML<MusicXML>(gttm_urls.msc),
    getJSONfromXML<GroupingStructure>(gttm_urls.grp),
    getJSONfromXML<MetricalStructure>(gttm_urls.mtr),
    getJSONfromXML<ITimeSpanReduction>(gttm_urls.tsr),
    getJSONfromXML<IProlongationalReduction>(gttm_urls.pr),
    */
  ];
};
var compoundMusicData = (title2) => (e) => {
  const [roman, read_melody, musicxml, grouping, metric, time_span, prolongation] = e;
  const ts = time_span ? new TimeSpanReduction(time_span).tstree.ts : void 0;
  const pr = prolongation ? new ProlongationalReduction(prolongation).prtree.pr : void 0;
  const measure = title2.id === "doremi" ? 3.5 : 7;
  const reduction = title2.mode === "PR" && pr || title2.mode === "TSR" && ts;
  const matrix = ts?.getMatrixOfLayer(ts.getDepthCount() - 1);
  const hierarchical_melody = reduction && matrix && musicxml && getHierarchicalMelody(measure, reduction, matrix, musicxml, roman) || [read_melody];
  const melody = hierarchical_melody[hierarchical_melody.length - 1];
  return new AnalyzedMusicData(
    roman,
    melody,
    hierarchical_melody,
    new GTTMData(grouping, metric, time_span, prolongation)
  );
};
var GTTM_URLs = class {
  msc;
  grp;
  mtr;
  tsr;
  pr;
  constructor(title2, resources) {
    this.msc = `https://clone-of-gttm-database.vercel.app/api/MSC?tune=${title2.id}`;
    this.grp = `https://clone-of-gttm-database.vercel.app/api/GPR?tune=${title2.id}`;
    this.mtr = `https://clone-of-gttm-database.vercel.app/api/MPR?tune=${title2.id}`;
    this.tsr = `https://clone-of-gttm-database.vercel.app/api/TS?tune=${title2.id}`;
    this.pr = `https://clone-of-gttm-database.vercel.app/api/PR?tune=${title2.id}`;
  }
};
var AnalysisURLs = class {
  melody;
  roman;
  constructor(title2, resources) {
    this.melody = `${resources}/${title2.id}/analyzed/melody/crepe/manalyze.json`;
    this.roman = `${resources}/${title2.id}/analyzed/chord/roman.json`;
  }
};
var loadMusicAnalysis = (title2, resources) => {
  const tune_name = encodeURI(title2.id);
  return Promise.all(justLoad(new AnalysisURLs(title2, resources), new GTTM_URLs(title2, resources))).then(compoundMusicData(title2));
};
var registerSong = (urls, default_url, audio_player2) => {
  const url = urls.pop();
  if (!url) {
    audio_player2.src = default_url;
    return;
  }
  audio_player2.muted = false;
  audio_player2.src = url;
  audio_player2.onerror = () => {
    audio_player2.muted = true;
    registerSong(urls, default_url, audio_player2);
  };
};
var setAudioPlayer = (title2, resources, audio_src, audio_player2) => {
  const filename = `${resources}/${title2.id}/${title2.id}`;
  const extensions = ["mp3", "mp4", "wav", "m4a"];
  registerSong(extensions.map((e) => `${filename}.${e}`), audio_src, audio_player2);
};
var titleHead = title;
var main = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const title2 = new TitleInfo(
    urlParams.get("tune") || "",
    urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : ""
  );
  const resources = `/resources`;
  const audio_src = `/resources/\u7121\u97F3.mp3`;
  updateTitle(titleHead, title2);
  setAudioPlayer(title2, resources, audio_src, audio_player);
  loadMusicAnalysis(title2, resources).then(setup(window, audio_player, titleHead, piano_roll_place, title2));
};
main();
