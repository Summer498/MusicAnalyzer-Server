import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";
import { hsv2rgb } from "@music-analyzer/color";
import { rgbToString } from "@music-analyzer/color";
import { SerializedMelodyAnalysis } from "@music-analyzer/melody-analyze";
import { SerializedTimeAndAnalyzedMelody } from "@music-analyzer/melody-analyze";
import { black_key_height, PianoRollConverter } from "@music-analyzer/view-parameters";
import { Time } from "@music-analyzer/time-and";
import { DMelodyController, TimeRangeController } from "@music-analyzer/controllers";

interface IDMelodyModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly melody_analysis: SerializedMelodyAnalysis;
}

const updateX_DMelodyView = (svg: SVGRectElement) => (x: number) => { svg.setAttribute("x", String(x)); }
const updateY_DMelodyView = (svg: SVGRectElement) => (y: number) => { svg.setAttribute("y", String(y)); }
const updateWidth_DMelodyView = (svg: SVGRectElement) => (w: number) => { svg.setAttribute("width", String(w)); }
const updateHeight_DMelodyView = (svg: SVGRectElement) => (h: number) => { svg.setAttribute("height", String(h)); }

const updateX = (svg: SVGRectElement) => (begin: number) => { updateX_DMelodyView(svg)(PianoRollConverter.scaled(begin)) }
const updateY = (svg: SVGRectElement) => (note: number) => { updateY_DMelodyView(svg)(PianoRollConverter.midi2NNBlackCoordinate(note)); }
const updateWidth = (svg: SVGRectElement) => (duration: number) => { updateWidth_DMelodyView(svg)(PianoRollConverter.scaled(duration)) }
const updateHeight = (svg: SVGRectElement) => { updateHeight_DMelodyView(svg)(black_key_height) }
const onWindowResized = (svg: SVGRectElement) => (model: IDMelodyModel) => {
  updateX(svg)(model.time.begin);
  updateWidth(svg)(model.time.duration);
  updateHeight(svg);
}
const onTimeRangeChanged = onWindowResized

const onDMelodyVisibilityChanged = (svg: SVGGElement) => (visible: boolean) => {
  const visibility = visible ? "visible" : "hidden";
  svg.setAttribute("visibility", visibility);
}
const onAudioUpdate = (svg: SVGGElement) => { svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }

function getMelodyViewSVG() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "rect")
  svg.id = "melody-note";
  svg.style.fill = rgbToString(hsv2rgb(0, 0, 0.75));
  svg.style.stroke = "rgb(64, 64, 64)";
  return svg;
}

function getSVGG(id: string, parts: { svg: SVGElement }[]) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  parts.forEach(e => svg.appendChild(e.svg));
  return svg;
}

export function buildDMelody(
  d_melody: SerializedTimeAndAnalyzedMelody[],
  controllers: {
    readonly audio: AudioReflectableRegistry,
    readonly d_melody: DMelodyController,
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
  }
) {
  const children = d_melody.map(melody => {
    const svg = getMelodyViewSVG();
    updateX(svg)(melody.time.begin);
    updateY(svg)(melody.note);
    updateWidth(svg)(melody.time.duration);
    updateHeight(svg);

    return { model: melody, svg }
  })
  const svg = getSVGG("detected-melody", children);

  const d_melody_collection = { svg, children };

  controllers.window.addListeners(...d_melody_collection.children.map(e => () => onWindowResized(e.svg)(e.model)));
  controllers.time_range.addListeners(...d_melody_collection.children.map(e => () => onTimeRangeChanged(e.svg)(e.model)));
  controllers.d_melody.addListeners(onDMelodyVisibilityChanged(d_melody_collection.svg));
  controllers.audio.addListeners(() => onAudioUpdate(d_melody_collection.svg));
  onAudioUpdate(d_melody_collection.svg)

  return d_melody_collection.svg;
}
