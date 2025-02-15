import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { IMelodyModel } from "@music-analyzer/melody-analyze";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { appendController, appendPianoRoll } from "./src/song-manager";
import { bracket_hight, NowAt, PianoRollBegin, PianoRollEnd } from "@music-analyzer/view-parameters";

// 分析データ-->
import { MusicAnalyzerWindow } from "./src/MusicAnalyzerWindow";

declare const window: MusicAnalyzerWindow;
declare const audio_player: HTMLAudioElement | HTMLVideoElement;
declare const piano_roll_place: HTMLDivElement;
declare const controllers: HTMLDivElement;
declare const title: HTMLHeadingElement;

import { MusicXML } from "@music-analyzer/gttm";
import { xml_parser } from "./src/XMLParser";
import { GRP, MTR, TSR, PRR, D_TSR, D_PRR } from "@music-analyzer/gttm";
import { getHierarchicalMelody } from "./src/HierarchicalMelody";
import { song_list } from "./src/songlist";
import { SongManager } from "@music-analyzer/piano-roll";

const keyLength = (obj: object) => Object.keys(obj).length;
const getJSON = async <T extends object>(url: string) => {
  return fetch(url)
    .then(res => res.json() as T)
    .catch(e => { console.error(e); return undefined; });
};
const getJSONfromXML = async <T extends object>(url: string) => {
  return fetch(url)
    .then(res => res.text())
    .then(e => {
      const parsed = xml_parser.parse(e) as T;
      return keyLength(parsed) ? parsed : undefined;
    })
    .catch(e => { console.error(e); return undefined; });
};

(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tune_id = urlParams.get("tune") || "";
  const tune_name = encodeURI(tune_id);
  const roman = tune_id !== "doremi" ? [] : await getJSON<TimeAndRomanAnalysis[]>("/MusicAnalyzer-server/resources/Hierarchical Analysis Sample/analyzed/chord/roman.json");
  const read_melody = (await getJSON<IMelodyModel[]>(`/MusicAnalyzer-server/resources/${tune_name}/analyzed/melody/crepe/manalyze.json`))
    ?.map(e => ({ ...e, head: { begin: e.begin, end: e.end } })) as IMelodyModel[];
  const musicxml = await getJSONfromXML<MusicXML>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/MSC-${tune_name}.xml`);
  const grouping = await getJSONfromXML<GRP>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/GPR-${tune_name}.xml`);
  const metric = await getJSONfromXML<MTR>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/MPR-${tune_name}.xml`);
  const time_span = await getJSONfromXML<D_TSR>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/TS-${tune_name}.xml`);
  const prolongation = await getJSONfromXML<D_PRR>(`/MusicAnalyzer-server/resources/gttm-example/${tune_name}/PR-${tune_name}.xml`);

  const mode: "TSR" | "PR" | "" = urlParams.has("pr") ? "PR" : urlParams.has("tsr") ? "TSR" : "";
  title.textContent = `[${mode}] ${tune_id}`;
  const tune_match = tune_id.match(/([0-9]+)_[0-9]/);
  const tune_no = tune_match ? Number(tune_match[1]) : Number(tune_id);
  if (tune_no) {
    const song_data = song_list[tune_no];
    title.innerHTML = `[${mode}] ${tune_id}, ${song_data.author}, <i>"${song_data.title}"</i>`;
  }

  const ts = time_span ? new TSR(time_span).tstree.ts : undefined;
  const pr = prolongation ? new PRR(prolongation).prtree.pr : undefined;

  const hierarchical_melody = (() => {
    const matrix = ts ? ts.getMatrixOfLayer(ts.getDepthCount() - 1) : undefined;
    const measure = tune_id === "doremi" ? 3.5 : 7;
    if (mode === "PR") { return getHierarchicalMelody(measure, pr!, matrix!, musicxml!, roman!); }
    else if (mode === "TSR") { return getHierarchicalMelody(measure, ts!, matrix!, musicxml!, roman!); }
    else { return [read_melody]; }
  })();

  const melody = hierarchical_melody[hierarchical_melody.length - 1];
  window.MusicAnalyzer = {
    roman: roman!,
    melody,
    hierarchical_melody,
    musicxml: musicxml!,
    GTTM: {
      grouping: grouping!,
      metric: metric!,
      time_span: time_span!,
      prolongation: prolongation!,
    },
  };

  // <-- 分析データ


  const d_romans: TimeAndRomanAnalysis[] = window.MusicAnalyzer.roman.map(e => e);
  const d_melodies: IMelodyModel[] = window.MusicAnalyzer.melody.map(e => ({
    ...e
  }));
  const romans = d_romans.map(e => e);
  const melodies = d_melodies.map(e => e).filter((e, i) => i + 1 >= d_melodies.length || 60 / (d_melodies[i + 1].begin - d_melodies[i].begin) < 300 * 4);

  // テンポの計算
  const beat_info = calcTempo(melodies, romans);
  /*
  console.log("tempo");
  console.log(beat_info.tempo);
  console.log("duration");
  console.log(audio_player.duration);
  console.log("last melody");
  console.log(melodies[melodies.length - 1].end);
  */


  // SVG -->
  const highest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note > c.note ? p : c).note || 0;
  const lowest_pitch = melody.reduce((p, c) => isNaN(p.note) ? c : isNaN(c.note) ? p : p.note < c.note ? p : c).note || 0;
  PianoRollBegin.value = highest_pitch + Math.floor(hierarchical_melody.length * bracket_hight / 12) * 12 + 12;
  PianoRollEnd.value = lowest_pitch - 3;
  const song_manager = new SongManager(beat_info, romans, hierarchical_melody, d_melodies);
  // song_manager.analysis_data = { beat_info, romans, hierarchical_melody: [melodies], d_melodies };
  const piano_roll = appendPianoRoll(piano_roll_place, song_manager);
  appendController(controllers, piano_roll);
  // <-- SVG

  // メインループ -->

  let old_time = Date.now();
  const fps_element = document.createElement("p");
  fps_element.id = "fps";
  fps_element.textContent = `fps:${0}`;

  let last_audio_time = Number.MIN_SAFE_INTEGER;
  const audioUpdate = () => {
    // --> audio 関連処理
    const now_at = audio_player.currentTime;
    if (audio_player.paused && now_at === last_audio_time) { return; }
    last_audio_time = now_at;
    NowAt.value = now_at;
    piano_roll.accompany_to_audio_registry.onAudioUpdate();
    // <-- audio 関連処理
  };

  const onUpdate = () => {
    // fps 関連処理 -->
    const now = Date.now();
    const fps = Math.floor(1000 / (now - old_time));
    fps_element.textContent = `fps:${(" " + fps).slice(-3)} ${fps < 60 ? '<' : '>'} 60`;
    old_time = now;
    // <-- fps 関連処理

    audioUpdate();
  };


  // TODO: refresh を draw のときに呼び出すようにする
  // 多分値が最初の時刻を想定した値になっているので直す
  const onWindowResized = () => {
    // 各 svg のパラメータを更新する
    piano_roll.window_reflectable_registry.onWindowResized();
    onUpdate();
  };



  // ---------- main ---------- //
  const main = () => {
    const update = () => {
      onUpdate();
      requestAnimationFrame(update);
    };

    window.onresize = e => onWindowResized();
    onWindowResized();
    update();

    document.body.insertAdjacentElement("beforeend", fps_element);
    0 && console.log(beat_info.tempo);
  };
  main();
})();
