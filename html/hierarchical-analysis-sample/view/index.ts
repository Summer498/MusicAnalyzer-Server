import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { WindowReflectableRegistry, AccompanyToAudioRegistry } from "@music-analyzer/view";
import { appendController, appendPianoRoll, SongManager } from "./src/song-manager";
import { bracket_hight, NowAt, PianoRollBegin, PianoRollEnd } from "@music-analyzer/view-parameters";

// 分析データ-->
import { MusicAnalyzerWindow } from "./src/MusicAnalyzerWindow";

declare const window: MusicAnalyzerWindow;
declare const audio_player: HTMLAudioElement | HTMLVideoElement;
declare const piano_roll_place: HTMLDivElement;
declare const controllers: HTMLDivElement;
declare const title: HTMLHeadingElement;

import { MusicXML } from "@music-analyzer/gttm/src/MusicXML";
import { xml_parser } from "./src/XMLParser";
import { GRP, MTR, TSR, PRR, D_TSR, D_PRR } from "@music-analyzer/gttm";
import { getHierarchicalMelody } from "./src/HierarchicalMelody";
import { song_list } from "./src/songlist";
(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tune_id = urlParams.get("tune");
  const roman = (await (await fetch("/MusicAnalyzer-server/resources/Hierarchical Analysis Sample/analyzed/chord/roman.json")).json()) as TimeAndRomanAnalysis[];
  const musicxml = (await xml_parser.parse(await (await fetch(`/MusicAnalyzer-server/resources/gttm-example/${tune_id}/MSC-${tune_id}.xml`)).text())) as MusicXML;
  const do_re_mi_grp = (await xml_parser.parse(await (await fetch(`/MusicAnalyzer-server/resources/gttm-example/${tune_id}/GPR-${tune_id}.xml`)).text()) as GRP);
  const do_re_mi_mtr = (await xml_parser.parse(await (await fetch(`/MusicAnalyzer-server/resources/gttm-example/${tune_id}/MPR-${tune_id}.xml`)).text()) as MTR);
  const do_re_mi_tsr = (await xml_parser.parse(await (await fetch(`/MusicAnalyzer-server/resources/gttm-example/${tune_id}/TS-${tune_id}.xml`)).text()) as D_TSR);
  const do_re_mi_pr = (await xml_parser.parse(await (await fetch(`/MusicAnalyzer-server/resources/gttm-example/${tune_id}/PR-${tune_id}.xml`)).text()) as D_PRR);

  const mode: "TSR" | "PR" = "TSR";
  title.textContent = `[${mode}] ${tune_id}`;
  const tune_match = tune_id?.match(/([0-9]+)_[0-9]/);
  const tune_no = tune_match ? Number(tune_match[1]) : Number(tune_id);
  if (tune_no) {
    const song_data = song_list[tune_no];
    title.innerHTML = `[${mode}] ${tune_id}, ${song_data.author}, <i>"${song_data.title}"</i>`;
  }

  const ts = new TSR(do_re_mi_tsr).tstree.ts;
  const pr = (() => {
    try {
      return new PRR(do_re_mi_pr).prtree.pr;
    } catch (e) { }
  })();

  const matrix = ts.getMatrixOfLayer(ts.getDepthCount() - 1);
  const hierarchical_melody = getHierarchicalMelody(String(mode) === "PR" ? pr ! : ts, matrix, musicxml, roman);

  // const org_melody = await (await fetch("/MusicAnalyzer-server/resources/Hierarchical Analysis Sample/analyzed/melody/crepe/vocals.json")).json() as number[];
  // const time_and_melody = getTimeAndMelody(org_melody, 100);
  const melody = hierarchical_melody[hierarchical_melody.length - 1];
  // const melody = analyzeMelody(time_and_melody, roman);  // NOTE: analyzeMelody をフロントから取り扱えるようにした
  // const melody = (await (await fetch("/MusicAnalyzer-server/resources/Hierarchical Analysis Sample/analyzed/melody/crepe/manalyze.json")).json()) as TimeAndMelodyAnalysis[];
  window.MusicAnalyzer = {
    roman,
    melody,
    hierarchical_melody,
    musicxml,
    GTTM: {
      grouping: do_re_mi_grp,
      metric: do_re_mi_mtr,
      time_span: do_re_mi_tsr,
      prolongation: do_re_mi_pr,
    },
  };

  // <-- 分析データ


  const d_romans: TimeAndRomanAnalysis[] = window.MusicAnalyzer.roman.map(e => e);
  const d_melodies: TimeAndMelodyAnalysis[] = window.MusicAnalyzer.melody.map(e => ({
    begin: e.begin,
    end: e.end,
    head: { ...e.head },
    melody_analysis: e.melody_analysis,
    note: e.note,
    roman_name: e.roman_name,
  }));
  const romans = d_romans.map(e => e);
  const melodies = d_melodies.map(e => e).filter((e, i) => i + 1 >= d_melodies.length || 60 / (d_melodies[i + 1].begin - d_melodies[i].begin) < 300 * 4);

  // テンポの計算 (試運転)
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
  const highest_pitch = melody.reduce((p, c) => p.note === undefined ? c : c.note === undefined ? p : p.note > c.note ? p : c).note || 0;
  const lowest_pitch = melody.reduce((p, c) => p.note === undefined ? c : c.note === undefined ? p : p.note < c.note ? p : c).note || 0;
  PianoRollBegin.value = highest_pitch + Math.floor(hierarchical_melody.length * bracket_hight / 12) * 12 + 12;
  PianoRollEnd.value = lowest_pitch - 3;
  const song_manager = new SongManager(beat_info, romans, hierarchical_melody, d_melodies);
  // song_manager.analysis_data = { beat_info, romans, hierarchical_melody: [melodies], d_melodies };
  appendPianoRoll(piano_roll_place, song_manager);
  appendController(controllers);
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
    AccompanyToAudioRegistry.instance.onAudioUpdate();
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
    WindowReflectableRegistry.instance.onWindowResized();
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

    0 && (
      document.body.insertAdjacentElement("beforeend", fps_element),
      console.log(beat_info.tempo)
    );
  };
  main();
})();
