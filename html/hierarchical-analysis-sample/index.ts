import { HTML } from "@music-analyzer/html";
import { play } from "@music-analyzer/synth";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { analyzeMelody, getTimeAndMelody, TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { getPianoRoll } from "@music-analyzer/svg-objects";
import { chord_gravities, deleteMelody, insertMelody, key_gravities, melody_beep_switcher, melody_beep_volume, show_melody_beep_volume } from "@music-analyzer/melody-view";
import { MusicXML, Pitch, } from "@music-analyzer/gttm/src/MusicXML";
import { getChroma } from "@music-analyzer/tonal-objects";

// 分析データ-->
import { GRP, MTR, D_TSR, PR, do_re_mi_grp, do_re_mi_mtr, do_re_mi_tsr } from "@music-analyzer/gttm";

interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: {
    roman: TimeAndRomanAnalysis[],
    hierarchical_melody: TimeAndMelodyAnalysis[][],
    melody: TimeAndMelodyAnalysis[],
    musicxml: MusicXML,
    GTTM: {
      grouping: GRP,
      metric: MTR,
      time_span: D_TSR,
      prolongation: PR,
    }
    insertMelody: typeof insertMelody,
    deleteMelody: typeof deleteMelody,
    play: typeof play
  }
}

declare const window: MusicAnalyzerWindow;
declare const audio_player: HTMLAudioElement | HTMLVideoElement;
declare const piano_roll_place: HTMLDivElement;

import { X2jOptions, XMLParser } from "fast-xml-parser";
import { UpdatableRegistry, WindowReflectableRegistry } from "@music-analyzer/view";
import { TS, TSR } from "@music-analyzer/gttm/src/TSR";
import { BeatPos } from "@music-analyzer/gttm/src/common";
import { getRange } from "@music-analyzer/math";
(async () => {
  const xml_options: X2jOptions = {
    preserveOrder: false,
    attributeNamePrefix: "",
    attributesGroupName: false,
    textNodeName: "text",
    ignoreAttributes: false,
    removeNSPrefix: false,
    allowBooleanAttributes: true,
    parseTagValue: true,
    parseAttributeValue: true,
    trimValues: true,
    cdataPropName: false,
    commentPropName: false,
    numberParseOptions: {
      hex: false,
      leadingZeros: false,
      skipLike: /.^/,  // /.^/ matches nothing
      eNotation: false,
    },
    stopNodes: [],
    unpairedTags: [],
    alwaysCreateTextNode: false,
    processEntities: true,
    htmlEntities: false,
    ignoreDeclaration: true,
    ignorePiTags: false,
    transformTagName: false,
    transformAttributeName: false,
  };
  const xml_parser = new XMLParser(xml_options);

  // TODO: avoid specific file: change to general
  const roman = (await (await fetch("../../resources/Hierarchical Analysis Sample/analyzed/chord/roman.json")).json()) as TimeAndRomanAnalysis[];
  const musicxml = (await xml_parser.parse(await (await fetch("../../resources/Hierarchical Analysis Sample/sample1.xml")).text())) as MusicXML;


  // NOTE: duration と chroma を取るところまではできた
  // TODO: 
  // 1. duration と given parameters から時刻に変換する
  // 2. chroma と時刻から melody svg を作る
  const calcChroma = (pitch: Pitch) => 12 + pitch.octave * 12 + (pitch.alter || 0) + getChroma(pitch.step);
  const getTimeAndMelodyFromTS = (ts: TS, musicxml: MusicXML) => {
    const regexp = /P1-([0-9]+)-([0-9]+)/;
    const match = ts.head.chord.note.id.match(regexp);
    if (match) {
      const id_measure = Number(match[1]);
      const id_note = Number(match[2]);
      const note = musicxml["score-partwise"].part.measure[id_measure - 1].note;
      const pitch = Array.isArray(note) ? note[id_note - 1].pitch : note.pitch;
      return { note: calcChroma(pitch), begin: ts.leftend, end: ts.leftend + (ts.rightend -ts.leftend)*7/8 };  // 開始と終了がくっつくのを防ぐために note の長さをちょっと短くしておく
    }
    else {
      throw new SyntaxError(`Unexpected id received.\nExpected id is: ${regexp}`);
    }
  };

  const ts = new TSR(do_re_mi_tsr).tstree.ts;
  console.log("layers of ts tree");
  console.log(ts.getArrayOfLayer(1000));
  console.log(ts.getArrayOfLayer());
  console.log(ts.getArrayOfLayer()?.map(e => getTimeAndMelodyFromTS(e, musicxml)));  // レイヤー毎に note[] を取れる
  // 階層 3 の IR 分析
  const time_and_melodies = ts.getArrayOfLayer(3)!.map(e => getTimeAndMelodyFromTS(e, musicxml));
  console.log(time_and_melodies);
  console.log(analyzeMelody(time_and_melodies, roman));

  // 全階層分の IR 分析
  console.log(`depth: ${ts.getDepthCount()}`);
  console.log(getRange(0, ts.getDepthCount()).map(i => ts.getArrayOfLayer(i)));
  const hierarchical_time_and_melodies = getRange(0, ts.getDepthCount()).map(i => ts.getArrayOfLayer(i)!.map(e => getTimeAndMelodyFromTS(e, musicxml)));
  console.log(hierarchical_time_and_melodies);
  //TODO: begin, end を適切な位置 (開始位置＋長さ) に変換する
  hierarchical_time_and_melodies.forEach(e=>e.forEach(e=>{
    const w = 3.5 / 8;  // NOTE: 1 measure = 3.5
    const b = 0.16;  // 補正される分を逆補正
    e.begin = e.begin * w + b;
    e.end = e.end * w + b;
    e.note = e.note - 2;  // ハ長調から変ロ長調にシフト
  }));
  console.log(hierarchical_time_and_melodies);
  const hierarchical_melody = hierarchical_time_and_melodies.map(e => analyzeMelody(e, roman).map(e => ({ IR: e.melody_analysis.implication_realization.symbol, ...e })));
  console.log(hierarchical_melody);
  
  console.log(do_re_mi_tsr);

  // const org_melody = await (await fetch("../../resources/Hierarchical Analysis Sample/analyzed/melody/crepe/vocals.json")).json() as number[];
  // const time_and_melody = getTimeAndMelody(org_melody, 100);
  const melody = hierarchical_melody[hierarchical_melody.length-1];
  // const melody = analyzeMelody(time_and_melody, roman);  // NOTE: analyzeMelody フロントからを取り扱えるようにした
  // const melody = (await (await fetch("../../resources/Hierarchical Analysis Sample/analyzed/melody/crepe/manalyze.json")).json()) as TimeAndMelodyAnalysis[];
  window.MusicAnalyzer = {
    roman,
    melody,
    hierarchical_melody,
    musicxml,
    GTTM: {
      grouping: do_re_mi_grp,
      metric: do_re_mi_mtr,
      time_span: do_re_mi_tsr,
      prolongation: undefined,
    },
    insertMelody,
    deleteMelody,
    play
  };

  // <-- 分析データ


  const d_romans: TimeAndRomanAnalysis[] = window.MusicAnalyzer.roman.map(e => e);
  const d_melodies: TimeAndMelodyAnalysis[] = window.MusicAnalyzer.melody.map(e => ({
    begin: e.begin - 0.16,  // ズレ補正
    end: e.end - 0.16,
    melody_analysis: e.melody_analysis,
    note: e.note,
    roman_name: e.roman_name
  }));
  const romans = d_romans.map(e => e);
  const melodies = d_melodies.map(e => e).filter((e, i) => i + 1 >= d_melodies.length || 60 / (d_melodies[i + 1].begin - d_melodies[i].begin) < 300 * 4);

  window.MusicAnalyzer.insertMelody = insertMelody;
  window.MusicAnalyzer.deleteMelody = deleteMelody;
  window.MusicAnalyzer.play = play;  // NOTE:コンソールデバッグ用

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
  // ボタン
  /*
  const slider = HTML.input({ type: "range", id: "slider" });
  const show_slider_value = HTML.span({}, slider.value);
  slider.addEventListener("input", e => { show_slider_value.textContent = slider.value; });
  */
  const key_gravity_switcher = HTML.input_checkbox({ id: "key_gravity_switcher", name: "key_gravity_switcher" });
  key_gravity_switcher.checked = true;
  key_gravity_switcher.addEventListener("change", e => { key_gravities.forEach(key_gravity => key_gravity.setAttribute("visibility", key_gravity_switcher.checked ? "visible" : "hidden")); });
  const chord_gravity_switcher = HTML.input_checkbox({ id: "chord_gravity_switcher", name: "chord_gravity_switcher" });
  chord_gravity_switcher.checked = true;
  chord_gravity_switcher.addEventListener("change", e => { chord_gravities.forEach(chord_gravity => chord_gravity.setAttribute("visibility", chord_gravity_switcher.checked ? "visible" : "hidden")); });
  /*
  // NOTE: 色選択は未実装なので消しておく
  const key_color_selector = HTML.input_radio({ name: "key_color_selector", id: "key_color_selector", value: "key", checked: `${true}` }, "key based color");
  const chord_color_selector = HTML.input_radio({ name: "chord_color_selector", id: "chord_color_selector", value: "chord" }, "chord based color");
  const melody_color_selector =
  HTML.div({ display: "inline" }, "", [
    HTML.label({ for: "color-selector-key" }, "key based color"),
    key_color_selector,
    HTML.label({ for: "color-selector-chord" }, "chord based color"),
    chord_color_selector,
    ]);
  */

  // svg element の作成
  const piano_roll = getPianoRoll({ beat_info, hierarchical_melody, romans, melodies, d_melodies });

  // 設定
  piano_roll_place.appendChildren([
    // slider,
    // show_slider_value,
    HTML.div({ id: "gravity-switcher" }, "", [
      HTML.span({}, "", [
        HTML.label({ for: "key_gravity_switcher" }, "Key Gravity"),
        key_gravity_switcher,
      ]),
      HTML.span({}, "", [
        HTML.label({ for: "chord_gravity_switcher" }, "Chord Gravity"),
        chord_gravity_switcher,
      ])
    ]),
    HTML.span({}, "", [
      HTML.label({ for: "melody_beep_switcher" }, "Beep Melody"),
      melody_beep_switcher,
      melody_beep_volume,
      show_melody_beep_volume,
    ]),
    // NOTE: 色選択は未実装なので消しておく
    // melody_color_selector,
    piano_roll.svg[0].svg
  ]);
  // <-- SVG

  // メインループ -->

  let old_time = Date.now();
  const fps_element = HTML.p({ name: "fps" }, `fps:${0}`);

  let last_audio_time = Number.MIN_SAFE_INTEGER;
  const onUpdate = () => {
    // fps 関連処理 -->
    const now = Date.now();
    const fps = Math.floor(1000 / (now - old_time));
    fps_element.textContent = `fps:${(" " + fps).slice(-3)} ${fps < 60 ? '<' : '>'} 60`;
    old_time = now;
    // <-- fps 関連処理

    // --> audio 関連処理
    const now_at = audio_player.currentTime;
    // TODO: 止めたときの挙動がおかしいので直す
    // 大量の計算を行った後のアニメーションの挙動はちょっとおかしくなるらしい
    if (audio_player.paused && now_at === last_audio_time) { return; }
    last_audio_time = now_at;
    // <-- audio 関連処理

    UpdatableRegistry.instance.onUpdate(now_at);
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
