import { HTML, SVG } from "@music-analyzer/html";
import { play } from "@music-analyzer/synth";
import { chord_name_margin, chord_text_size, getChordKeysSVG, getChordNamesSVG, getChordNotesSVG, getChordRomansSVG } from "@music-analyzer/chord-view";
import { TimeAndRomanAnalysis } from "@music-analyzer/chord-to-roman";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { calcTempo } from "@music-analyzer/beat-estimation";
import { getBlackBGs, getBlackKeys, getOctaveBGs, getOctaveKeys, getPianoRollWidth, getWhiteBGs, getWhiteKeys, piano_roll_height, piano_roll_time_length, current_time_ratio, WindowReflectableRegistry, UpdatableRegistry, SvgAndParams } from "@music-analyzer/view";
import { beepMelody, chord_gravities, deleteMelody, getArrowSVGs, getDMelodySVG, getIRSymbolSVG, getMelodySVG, insertMelody, key_gravities, melody_beep_switcher, melody_beep_volume, refresh_arrow, show_melody_beep_volume } from "@music-analyzer/melody-view";
import { getBeatBars } from "@music-analyzer/beat-view";

// 分析データ-->
import { GRP as Grouping, MTR as Metric, TSR as TimeSpan, PR as Prolongation, do_re_mi_grp, do_re_mi_mtr, do_re_mi_tsr } from "@music-analyzer/gttm";

interface MusicAnalyzerWindow extends Window {
  MusicAnalyzer: {
    roman: TimeAndRomanAnalysis[],
    melody: TimeAndMelodyAnalysis[],
    musicxml: any,
    GTTM: {
      grouping: Grouping,
      metric: Metric,
      time_span: TimeSpan,
      prolongation: Prolongation,
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
(async () => {
  const xml_options: X2jOptions = {
    preserveOrder: false,
    attributeNamePrefix: "",
    attributesGroupName: false,
    textNodeName: "#text",
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
  const melody = (await (await fetch("../../resources/Hierarchical Analysis Sample/analyzed/melody/crepe/manalyze.json")).json()) as TimeAndMelodyAnalysis[];
  const musicxml = await xml_parser.parse(await (await fetch("../../resources/Hierarchical Analysis Sample/sample1.xml")).text());
  window.MusicAnalyzer = {
    roman,
    melody,
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
  console.log("tempo");
  console.log(beat_info.tempo);
  console.log("duration");
  console.log(audio_player.duration);
  console.log("last melody");
  console.log(melodies[melodies.length - 1].end);
  
  // SVG -->
  // ボタン
  const slider = HTML.input({ type: "range", id: "slider" });
  const show_slider_value = HTML.span({}, slider.value);
  slider.addEventListener("input", e => { show_slider_value.textContent = slider.value; });
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
  const arrow_svgs = getArrowSVGs(melodies);
  const melody_svgs = getMelodySVG(melodies);

  const current_time_line = SVG.line({ name: "current_time", "stroke-width": 5, stroke: "#000" });

  const piano_roll =  new SvgAndParams(
    [{
      svg: SVG.svg({ name: "piano-roll" }, undefined, [
        // 奥側
        SVG.g({ name: "octave-BGs" }, undefined, getOctaveBGs(getWhiteBGs(), getBlackBGs()).svg.map(e => e.svg)),
      
        [
          getBeatBars(beat_info, melodies),
          getChordNotesSVG(romans),
          getChordNamesSVG(romans),
          getChordRomansSVG(romans),
          getChordKeysSVG(romans),
          getDMelodySVG(d_melodies),
          melody_svgs,
          getIRSymbolSVG(melodies)
        ].map(e => e.group),
      
        SVG.g({ name: "gravities" }, undefined, [
          arrow_svgs.map(e => e.line),
          arrow_svgs.map(e => e.triangle)
        ]),
      
        SVG.g({ name: "octave-keys" }, undefined, getOctaveKeys(getWhiteKeys(), getBlackKeys()).svg.map(e => e.svg)),
        current_time_line,
        // 手前側
      ].flat())
    }],
    (e, piano_roll_width) => { e.svg.setAttributes({ x: 0, y: 0, width: piano_roll_width, height: piano_roll_height + chord_text_size * 2 + chord_name_margin }); }
  );

  // 設定
  piano_roll_place.appendChildren([
    slider,
    show_slider_value,
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
    if (audio_player.paused && now_at === last_audio_time) {
      return;
    }
    last_audio_time = now_at;
    // <-- audio 関連処理

    // svg アップデート -->
    const piano_roll_width = getPianoRollWidth();
    const current_time_x = piano_roll_width * current_time_ratio;
    const note_size = piano_roll_width / piano_roll_time_length;

    key_gravities.forEach(e => e.setAttribute("visibility", key_gravity_switcher.checked ? "visible" : "hidden"));
    chord_gravities.forEach(e => e.setAttribute("visibility", chord_gravity_switcher.checked ? "visible" : "hidden"));

    UpdatableRegistry.instance.onUpdate(current_time_x, now_at, note_size);
    refresh_arrow(arrow_svgs, current_time_x, now_at, note_size);
    // <-- svg アップデート


    // 音出し
    /* NOTE: うるさいので停止中
    beepBeat(beat_bars, now_at);
    */
    melody_beep_switcher.checked && beepMelody(melody_svgs, now_at, Number(melody_beep_volume.value) / 400);
  };


  // TODO: refresh を draw のときに呼び出すようにする
  // 多分値が最初の時刻を想定した値になっているので直す
  const onWindowResized = () => {
    // 各 svg のパラメータを更新する
    const piano_roll_width = getPianoRollWidth();
    WindowReflectableRegistry.instance.onWindowResized(piano_roll_width);
    // piano_roll.svg[0].svg.setAttributes({ x: 0, y: 0, width: piano_roll_width, height: piano_roll_height + chord_text_size * 2 + chord_name_margin });

    const current_time_x = piano_roll_width * current_time_ratio;
    current_time_line.setAttributes({ x1: current_time_x, x2: current_time_x, y1: 0, y2: piano_roll_height });
    onUpdate();
  };



  // ---------- main ---------- //
  const main = async () => {
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
