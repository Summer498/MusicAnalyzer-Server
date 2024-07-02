import { HTML } from "@music-analyzer/html";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { analyzeMelody, TimeAndMelody, TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { getPianoRoll } from "@music-analyzer/svg-objects";
import { setHierarchyLevelSliderValues, controllers } from "@music-analyzer/melody-view";
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
import { NowAt } from "@music-analyzer/view-parameters";
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


  const calcChroma = (pitch: Pitch) => 12 + pitch.octave * 12 + (pitch.alter || 0) + getChroma(pitch.step);
  const getTimeAndMelodyFromTS = (ts: TS, musicxml: MusicXML): TimeAndMelody => {
    const regexp = /P1-([0-9]+)-([0-9]+)/;
    const match = ts.head.chord.note.id.match(regexp);
    if (match) {
      const id_measure = Number(match[1]);
      const id_note = Number(match[2]);
      const note = musicxml["score-partwise"].part.measure[id_measure - 1].note;
      const pitch = Array.isArray(note) ? note[id_note - 1].pitch : note.pitch;
      return { note: calcChroma(pitch), begin: ts.leftend, end: ts.rightend, head: { begin: ts.leftend, end: ts.rightend } };
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
  const hierarchical_time_and_melodies = getRange(0, ts.getDepthCount()).map(i => ts.getArrayOfLayer(i)!.map(e => {
    return {
      ...getTimeAndMelodyFromTS(e, musicxml),
      head: { begin: e.getHeadElement().leftend, end: e.getHeadElement().rightend }
    };
  }));
  console.log(hierarchical_time_and_melodies);
  //TODO: begin, end を適切な位置 (開始位置＋長さ) に変換する
  hierarchical_time_and_melodies.forEach(e => e.forEach(e => {
    const w = 3.5 / 8;  // NOTE: 1 measure = 3.5
    const b = 0;
    e.begin = e.begin * w + b;
    e.end = e.end * w + b;
    e.head.begin = e.head.begin * w + b;
    e.head.end = e.head.end * w + b;
    e.note = e.note - 2;  // ハ長調から変ロ長調にシフト
  }));
  console.log(hierarchical_time_and_melodies);
  const hierarchical_melody = hierarchical_time_and_melodies.map(time_and_melody => analyzeMelody(time_and_melody, roman).map(e => ({ IR: e.melody_analysis.implication_realization.symbol, ...e })));
  console.log(hierarchical_melody);

  console.log(do_re_mi_tsr);

  // const org_melody = await (await fetch("../../resources/Hierarchical Analysis Sample/analyzed/melody/crepe/vocals.json")).json() as number[];
  // const time_and_melody = getTimeAndMelody(org_melody, 100);
  const melody = hierarchical_melody[hierarchical_melody.length - 1];
  setHierarchyLevelSliderValues(hierarchical_melody.length - 1);
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
  };

  // <-- 分析データ


  const d_romans: TimeAndRomanAnalysis[] = window.MusicAnalyzer.roman.map(e => e);
  const d_melodies: TimeAndMelodyAnalysis[] = window.MusicAnalyzer.melody.map(e => ({
    begin: e.begin,
    end: e.end,
    head: { ...e.head },
    melody_analysis: e.melody_analysis,
    note: e.note,
    roman_name: e.roman_name
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
  // TODO: ボタン周りのリファクタリングをする
  piano_roll_place.appendChildren([
    getPianoRoll({ beat_info, hierarchical_melody, romans, d_melodies }).svg[0].svg,
    controllers,
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

    NowAt.onUpdate(now_at);
    UpdatableRegistry.instance.onUpdate();
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
