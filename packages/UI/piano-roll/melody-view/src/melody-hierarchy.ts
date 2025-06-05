import { deleteMelody } from "./melody-editor/delete";
import { ITriad } from "@music-analyzer/irm";
import { SerializedMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { play } from "@music-analyzer/synth";
import { black_key_height, NowAt, PianoRollConverter } from "@music-analyzer/view-parameters";
import { reservation_range } from "@music-analyzer/view-parameters";
import { HierarchyLevelController, MelodyBeepController, MelodyColorController, SetColor, TimeRangeController } from "@music-analyzer/controllers";
import { Time } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";

let _beep_volume = 0;
let _do_melody_beep = false;
let _sound_reserved = false;

interface I_MelodyModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly melody_analysis: SerializedMelodyAnalysis;
  readonly archetype: ITriad;
}

interface IMelody {
  readonly model: I_MelodyModel,
  readonly svg: SVGRectElement,
}

interface IMelodyLayer {
  readonly svg: SVGGElement;
  readonly parts: IMelody[];
  readonly layer: number;
}

interface IMelodyHierarchy {
  show: IMelodyLayer[];
  readonly svg: SVGGElement;
  readonly layers: IMelodyLayer[];
}

const _beepMelody = (model: I_MelodyModel) => {
  const volume = _beep_volume / 400;
  const pitch = [440 * Math.pow(2, (model.note - 69) / 12)];
  const begin_sec = model.time.begin - NowAt.get();
  const length_sec = model.time.duration;
  play(pitch, begin_sec, length_sec, volume);
  _sound_reserved = true;
  setTimeout(() => { _sound_reserved = false; }, reservation_range * 1000);
};
const beepMelody = (model: I_MelodyModel) => {
  if (!_do_melody_beep) { return; }
  if (!model.note) { return; }
  const model_is_in_range =
    new Time(0, reservation_range)
      .map(e => e + NowAt.get())
      .has(model.time.begin)
  if (model_is_in_range) {
    if (_sound_reserved === false) { _beepMelody(model); }
  }
};
const onMelodyBeepCheckChanged_MelodyBeep = (do_melody_beep: boolean) => { _do_melody_beep = do_melody_beep; }
const onMelodyVolumeBarChanged_MelodyBeep = (beep_volume: number) => { _beep_volume = beep_volume; }

const getMelodyModel = (e: SerializedTimeAndAnalyzedMelody) => ({
  time: e.time,
  head: e.head,
  note: e.note,
  melody_analysis: e.melody_analysis,
  archetype: e.melody_analysis.implication_realization as ITriad,
})

const updateX_MelodyView = (svg: SVGRectElement) => (x: number) => { svg.setAttribute("x", String(x)); }
const updateY_MelodyView = (svg: SVGRectElement) => (y: number) => { svg.setAttribute("y", String(y)); }
const updateWidth_MelodyView = (svg: SVGRectElement) => (w: number) => { svg.setAttribute("width", String(w)); }
const updateHeight_MelodyView = (svg: SVGRectElement) => (h: number) => { svg.setAttribute("height", String(h)); }
const setColor_MelodyView = (svg: SVGRectElement) => (color: string) => svg.setAttribute("fill", "#0d0");

const updateX = (svg: SVGRectElement) => (model: I_MelodyModel) => { updateX_MelodyView(svg)(PianoRollConverter.scaled(model.time.begin)) }
const updateY = (svg: SVGRectElement) => (model: I_MelodyModel) => { updateY_MelodyView(svg)(PianoRollConverter.midi2NNBlackCoordinate(model.note)); }
const updateWidth = (svg: SVGRectElement) => (model: I_MelodyModel) => { updateWidth_MelodyView(svg)(31 / 32 * PianoRollConverter.scaled(model.time.duration)) }
const updateHeight = (svg: SVGRectElement) => { updateHeight_MelodyView(svg)(black_key_height) }
const onWindowResized = (svg: SVGRectElement) => (model: I_MelodyModel) => {
  updateX(svg)(model);
  updateWidth(svg)(model);
}
const setColor = (svg: SVGRectElement) => (model: I_MelodyModel) => (f => setColor_MelodyView(svg)(f(model.archetype))) as SetColor
const onTimeRangeChanged = onWindowResized;
const beep = (model: I_MelodyModel) => { beepMelody(model); }
const onMelodyBeepCheckChanged = (e: boolean) => { onMelodyBeepCheckChanged_MelodyBeep(e); }
const onMelodyVolumeBarChanged = (e: number) => { onMelodyVolumeBarChanged_MelodyBeep(e); }

const beep_MelodyLayer = (children: IMelody[]) => { children.forEach(e => beep(e.model)); }
const onAudioUpdate_MelodyLayer = (svg: SVGGElement) => { svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }

const onAudioUpdate = (show: IMelodyLayer[]) => { show.forEach(e => beep_MelodyLayer(e.parts)) }
const beep_MelodyHierarchy = (children: IMelodyLayer[]) => { children.forEach(e => beep_MelodyLayer(e.parts)); }
const onChangedLayer = (svg: SVGGElement) => (e: { show: IMelodyLayer[] }) => (children: IMelodyLayer[]) => (value: number) => {
  e.show = children.filter(e => value === e.layer);
  e.show.forEach(e => onAudioUpdate_MelodyLayer(e.svg));
  svg.replaceChildren(...e.show.map(e => e.svg));
}

function getMelodySVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  svg.id = "melody-note";
  svg.style.stroke = "rgb(64, 64, 64)";
  svg.onclick = deleteMelody;
  return svg;
}

function getSVGG(id: string, children: { svg: SVGGElement }[]) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  children.forEach(e => svg.appendChild(e.svg));
  return svg;
}

const getParts = (e: SerializedTimeAndAnalyzedMelody) => {
  const model = getMelodyModel(e);
  const svg = getMelodySVG();

  updateX(svg)(model);
  updateY(svg)(model);
  updateWidth(svg)(model);
  updateHeight(svg);
  return { model, svg } as IMelody
}

const getLayers = (e: SerializedTimeAndAnalyzedMelody[], layer: number) => {
  const parts = e.map(getParts);
  const svg = getSVGG(`layer-${layer}`, parts);
  return { svg, parts, layer } as IMelodyLayer
}

export function buildMelody(
  h_melodies: SerializedTimeAndAnalyzedMelody[][],
  controllers: {
    readonly audio: AudioReflectableRegistry,
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
    readonly melody_beep: MelodyBeepController,
    readonly melody_color: MelodyColorController,
    readonly hierarchy: HierarchyLevelController,
  }
) {
  const layers = h_melodies.map(getLayers);

  const svg = getSVGG("melody", layers);
  const melody_hierarchy = { svg, layers, show: layers } as IMelodyHierarchy;

  controllers.window.addListeners(...melody_hierarchy.layers.flatMap(e => e.parts).map(e => () => onWindowResized(e.svg)(e.model)));
  controllers.hierarchy.addListeners(onChangedLayer(melody_hierarchy.svg)(melody_hierarchy)(melody_hierarchy.layers));
  controllers.time_range.addListeners(...melody_hierarchy.layers.flatMap(e => e.parts).map(e => () => onTimeRangeChanged(e.svg)(e.model)));
  controllers.melody_color.addListeners(...melody_hierarchy.layers.flatMap(e => e.parts).map(e => setColor(e.svg)(e.model)));
  controllers.melody_beep.checkbox.addListeners(...melody_hierarchy.layers.flatMap(e => e.parts).map(e => onMelodyBeepCheckChanged));
  controllers.melody_beep.volume.addListeners(...melody_hierarchy.layers.flatMap(e => e.parts).map(e => onMelodyVolumeBarChanged))
  controllers.audio.addListeners(...melody_hierarchy.layers.map(e => () => onAudioUpdate_MelodyLayer(e.svg)));
  controllers.audio.addListeners(...melody_hierarchy.show.map(e => () => beep_MelodyLayer(e.parts)));
  melody_hierarchy.layers.map(e => () => onAudioUpdate_MelodyLayer(e.svg))
  melody_hierarchy.show.map(e => beep_MelodyLayer(e.parts))

  return melody_hierarchy.svg;
}
