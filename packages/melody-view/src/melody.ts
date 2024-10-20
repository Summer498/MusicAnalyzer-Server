import { SVG } from "@music-analyzer/html";
import { TimeAndMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SvgCollection2, Updatable } from "@music-analyzer/view";
import { CurrentTimeX, NoteSize, NowAt, black_key_prm, PianoRollBegin, reservation_range } from "@music-analyzer/view-parameters";
import { get_color_of_Narmour_concept } from "@music-analyzer/irm";
import { fifthChromaToColor } from "@music-analyzer/color";
import { HierarchyLevel, MelodyBeepSwitcher, MelodyBeepVolume } from "@music-analyzer/controllers";
import { play } from "@music-analyzer/synth";
import { deleteMelody } from "./melody-editor-function";
export { getDMelodyControllers } from "./d-melody";


class MelodyModel {
  begin: number;
  end: number;
  note: number;
  layer: number;
  constructor(melody: TimeAndMelodyAnalysis, layer: number) {
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.layer = layer;
  }
}

class MelodyView {
  svg: SVGRectElement;
  sound_reserved: boolean;
  constructor(color: string) {
    this.svg = SVG.rect();
    this.svg.setAttribute("name", "melody-note");
    this.svg.setAttribute("fill", color);
    this.svg.setAttribute("stroke", "#444");
    this.sound_reserved = false;
  }
  set x(value: number) { this.svg.setAttribute("x", `${value}`); }
  set y(value: number) { this.svg.setAttribute("y", `${value}`); }
  set width(value: number) { this.svg.setAttribute("width", `${value}`); }
  set height(value: number) { this.svg.setAttribute("height", `${value}`); }
  get visibility() { 
    const visibility = this.svg.getAttribute("visibility");
    if (visibility === "visible" || visibility === "hidden"){return visibility;}
    else {throw new TypeError(`Illegal string received. Expected is "visible" or "hidden" but reserved is ${visibility}`);}
  }
  set visibility(value: "visible" | "hidden") { this.svg.setAttribute("visibility", value); }
  set onclick(value: () => void) { this.svg.onclick = value; }
}

class MelodyController implements Updatable {
  model: MelodyModel;
  view: MelodyView;
  hierarchy_level: HierarchyLevel;
  melody_beep_switcher: MelodyBeepSwitcher;
  melody_beep_volume: MelodyBeepVolume;

  constructor(melody: TimeAndMelodyAnalysis, hierarchy_level: HierarchyLevel, melody_beep_switcher: MelodyBeepSwitcher, melody_beep_volume: MelodyBeepVolume, layer?: number) {
    this.model = new MelodyModel(melody, layer || 0);
    // this.view = new MelodyView(get_color_on_parametric_scale(melody.melody_analysis.implication_realization));
    this.view = new MelodyView(get_color_of_Narmour_concept(melody.melody_analysis.implication_realization));
    // this.view = new MelodyView(fifthChromaToColor(melody.note, 0.75, 0.9));
    this.updateY();
    this.updateWidth();
    this.updateHeight();
    this.hierarchy_level = hierarchy_level;
    this.melody_beep_switcher = melody_beep_switcher;
    this.melody_beep_volume = melody_beep_volume;
    CurrentTimeX.onUpdate.push(this.updateX.bind(this));
    NowAt.onUpdate.push(this.updateX.bind(this));
    NoteSize.onUpdate.push(this.updateX.bind(this));
    NoteSize.onUpdate.push(this.updateWidth.bind(this));
    this.onUpdate();
  }
  updateX() { this.view.x = CurrentTimeX.value + (this.model.begin - NowAt.value) * NoteSize.value; }
  updateY() { this.view.y = (PianoRollBegin.value - this.model.note) * black_key_prm.height; }
  updateWidth() { this.view.width = (this.model.end - this.model.begin) * 15 / 16 * NoteSize.value; }
  updateHeight() { this.view.height = black_key_prm.height; }
  updateVisibility() {
    const is_visible = this.hierarchy_level.range.value === `${this.model.layer}`;
    this.view.visibility = is_visible ? "visible" : "hidden";
  }

  beepMelody = () => {
    const now_at = NowAt.value;

    if (now_at <= this.model.begin && this.model.begin < now_at + reservation_range) {
      console.log("this");
      console.log(this);
      console.log("this.view");
      console.log(this.view);
      if (this.view.sound_reserved === false) {
        console.log("this.view.sound_reserved === false");
        const volume = Number(this.melody_beep_volume.range.value) / 400;
        const pitch = [440 * Math.pow(2, (this.model.note - 69) / 12)];
        const begin_sec = this.model.begin - now_at;
        const length_sec = this.model.end - this.model.begin;
        console.log(`pitch: ${pitch}`);
        play(pitch, begin_sec, length_sec, volume);
        this.view.sound_reserved = true;
        setTimeout(() => { this.view.sound_reserved = false; }, reservation_range * 1000);
      }
    }
  };

  onUpdate() {
    this.updateVisibility();
    this.view.onclick = deleteMelody;
    console.log(this.melody_beep_switcher.checkbox.checked);
    console.log(this.view.visibility);
    if (this.melody_beep_switcher.checkbox.checked && this.view.visibility === "visible") {
      this.beepMelody();
    }
  }
}

export const getHierarchicalMelodyControllers = (hierarchical_melodies: TimeAndMelodyAnalysis[][], hierarchy_level: HierarchyLevel, melody_beep_switcher: MelodyBeepSwitcher, melody_beep_volume: MelodyBeepVolume) =>
  hierarchical_melodies.map((e, l) =>
    new SvgCollection2(
      `layer-${l}`,
      e.map(e => new MelodyController(e, hierarchy_level, melody_beep_switcher, melody_beep_volume, l))
    )
  );