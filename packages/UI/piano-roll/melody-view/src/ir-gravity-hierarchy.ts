import { black_key_height, PianoRollConverter } from "@music-analyzer/view-parameters";
import { NoteSize } from "@music-analyzer/view-parameters";
import { SerializedTimeAndAnalyzedMelody } from "./serialized-time-and-analyzed-melody";
import { Time } from "@music-analyzer/time-and";
import { AudioReflectableRegistry, PianoRollTranslateX, WindowReflectableRegistry } from "@music-analyzer/view";
import { HierarchyLevelController, MelodyColorController, TimeRangeController } from "@music-analyzer/controllers";
import { Triad } from "@music-analyzer/irm";
import { GetColor } from "@music-analyzer/controllers/src/color-selector";

interface IRGravityModel {
  readonly time: Time;
  readonly head: Time;
  readonly note: number;
  readonly layer: number;
  readonly archetype: Triad;
}

interface ILinePos {
  readonly x1: number,
  readonly x2: number,
  readonly y1: number,
  readonly y2: number,
}

interface I_IRGravity {
  readonly svg: SVGGElement,
  readonly model: IRGravityModel,
  readonly view: {
    readonly svg: SVGGElement,
    readonly triangle: SVGPolygonElement,
    readonly line: SVGLineElement,
  },
  readonly line_seed: ILinePos,
}

interface I_IRGravityLayer {
  readonly layer: number
  readonly svg: SVGGElement
  readonly children: I_IRGravity[]
  readonly show: I_IRGravity[];
}

function getTriangle() {
  const triangle_width = 4;
  const triangle_height = 5;

  const triangle_svg = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
  triangle_svg.classList.add("triangle");
  triangle_svg.id = "gravity-arrow";
  triangle_svg.style.stroke = "rgb(0, 0, 0)";
  triangle_svg.style.fill = "rgb(0, 0, 0)";
  triangle_svg.style.strokeWidth = String(5);
  triangle_svg.setAttribute("points", [0, 0, - triangle_width, + triangle_height, + triangle_width, + triangle_height].join(","));
  return triangle_svg;
}

function getLine() {
  const line_svg = document.createElementNS("http://www.w3.org/2000/svg", "line")
  line_svg.id = "gravity-arrow";
  line_svg.classList.add("line");
  line_svg.style.stroke = "rgb(0, 0, 0)";
  line_svg.style.strokeWidth = String(5);
  return line_svg;
}

function getGravitySVG(
  ...children: SVGElement[]
) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = "gravity";
  children.forEach(e => svg.appendChild(e));
  return svg
}

function getSVGG(id: string, children: SVGElement[]) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.id = id;
  children.forEach(e => svg.appendChild(e));
  return svg;
}

export function buildIRGravity(
  h_melodies: SerializedTimeAndAnalyzedMelody[][],
  controllers: {
    readonly audio: AudioReflectableRegistry,
    readonly window: WindowReflectableRegistry,
    readonly time_range: TimeRangeController,
    readonly melody_color: MelodyColorController,
    readonly hierarchy: HierarchyLevelController,
  }
) {
  const getLayers = (
    melodies: SerializedTimeAndAnalyzedMelody[],
    l: number
  ) => {
    const second = melodies.slice(1);
    const third = melodies.slice(2);
    const fourth = [...melodies.slice(3), undefined];
    const gravity = third.map((_, i) => {
      const past = melodies[i];
      const pre = second[i];
      const next = third[i];
      const re_next = fourth[i];

      const m3 = 3;
      const getImplication = (interval: number) => {
        const sign = Math.sign(interval);
        const I = Math.abs(interval);
        return (I < 6) ? { inf: sign * (I - m3), sup: sign * (I + m3), over: sign * (I + m3), sgn: 1 } : { inf: 0, sup: sign * (I - m3), over: sign * (I + m3), sgn: -1 }
      }

      const getReImplication = (observed: number, realization: number) => {
        const sign = Math.sign(observed);
        const implication = getImplication(observed);
        const O = sign * observed;
        const R = sign * realization;
        if (0 <= R && R < O - m3) // IR
        { }
        else if (0 <= -R && -R < O - m3) // R
        { }
        else if (O - m3 <= R && R < O + m3) // P
        { return }
        else if (O - m3 <= -R && -R < O + m3) // IP
        { }
        else if (O + m3 <= R) // VP
        { }
        else if (O + m3 <= -R) // VR
        { }
      }

      const implication = getImplication(pre.note - past.note)

      function getLinePos(
        e: { time: { begin: number, duration: number }, note: number },
        n: { time: { begin: number, duration: number }, note: number },
      ) {
        const convert = (arg: number) => [
          ((e: number) => e - 0.5),
          ((e: number) => PianoRollConverter.midi2BlackCoordinate(e)),
        ].reduce((c, f) => f(c), arg)

        const line_pos = {
          x1: e.time.begin + e.time.duration / 2,
          x2: n.time.begin + n.time.duration / 2,
          y1: isNaN(e.note) ? -99 : convert(e.note),
          y2: isNaN(n.note) ? -99 : convert(n.note),
        } as ILinePos
        return line_pos;
      }

      const line_pos_implication = getLinePos(
        { time: pre.time, note: pre.note },
        { time: next.time, note: pre.note + (implication.inf + implication.sup) / 2 }
      );
      if (re_next) {
        const IImplicationDist = re_next?.note + (implication.inf + implication.sup) / 2;
        const VImplicationDist = next.note + (implication.inf + implication.sup) / 2;
        const line_pos_reImplication = re_next && getLinePos(
          { time: next.time, note: next.note },
          { time: re_next.time, note: next.note }
        );
      }
      const model = {
        ...pre,
        archetype: pre.melody_analysis.implication_realization as Triad,
        layer: l || 0,
      } as IRGravityModel;
      const triangle = getTriangle();
      const line = getLine();
      //      line.style.color = get_color_of_Narmour_concept()
      const svg = getGravitySVG(triangle, line);
      const view = { svg, triangle, line };
      return { model, view, line_pos: line_pos_implication }
    })
      .filter(e => e !== undefined)
      .map(e => ({ svg: e.view.svg, model: e.model, view: e.view, line_seed: e.line_pos }))
    const svg = getSVGG(`layer-${l}`, gravity.map(e => e.svg));
    return ({
      layer: l,
      svg: svg,
      children: gravity,
      show: gravity,
    } as I_IRGravityLayer)
  }
  const children = h_melodies.map(getLayers);
  const svg = getSVGG("ir_gravity", children.map(e => e.svg));
  const ir_gravity = { svg, children, show: [] } as { svg: SVGGElement, children: I_IRGravityLayer[], show: I_IRGravityLayer[] };


  const onWindowResized_IRGravity = (
    e: {
      readonly svg: SVGGElement,
      readonly line_seed: ILinePos,
      readonly model: IRGravityModel,
      readonly view: {
        readonly svg: SVGGElement,
        readonly triangle: SVGPolygonElement,
        readonly line: SVGLineElement,
      },
    }
  ) => {
    svg.setAttribute("width", String(PianoRollConverter.scaled(e.model.time.duration)));
    svg.setAttribute("height", String(black_key_height));

    const line_pos = { x1: e.line_seed.x1 * NoteSize.get(), x2: e.line_seed.x2 * NoteSize.get(), y1: e.line_seed.y1 * 1, y2: e.line_seed.y2 * 1 } as ILinePos
    const angle = Math.atan2(line_pos.y2 - line_pos.y1, line_pos.x2 - line_pos.x1) * 180 / Math.PI + 90;
    e.view.triangle.setAttribute("transform", `translate(${line_pos.x2},${line_pos.y2}) rotate(${angle})`);
    e.view.line.setAttribute("x1", String(line_pos.x1));
    e.view.line.setAttribute("x2", String(line_pos.x2));
    e.view.line.setAttribute("y1", String(line_pos.y1));
    e.view.line.setAttribute("y2", String(line_pos.y2));
  }
  controllers.window.addListeners(...ir_gravity.children.flatMap(e => e.children).map(e => () => onWindowResized_IRGravity(e)));
  controllers.time_range.addListeners(...ir_gravity.children.flatMap(e => e.children).map(e => () => onWindowResized_IRGravity(e)));

  const onAudioUpdate = (svg: SVGGElement) => { svg.setAttribute("transform", `translate(${PianoRollTranslateX.get()})`); }
  controllers.hierarchy.addListeners(
    (value: number) => {
      ir_gravity.show = ir_gravity.children.filter(e => value === e.layer);
      ir_gravity.show.forEach(e => onAudioUpdate(e.svg));
      ir_gravity.svg.replaceChildren(...ir_gravity.show.map(e => e.svg));
    }
  );
  controllers.melody_color.addListeners(...ir_gravity.children.flatMap(e => e.children).map(e => (f: GetColor) => e.svg.style.fill = f(e.model.archetype)));
  controllers.audio.addListeners(...ir_gravity.children.map(e => () => onAudioUpdate(e.svg)));
  ir_gravity.children.map(e => onAudioUpdate(e.svg))

  return ir_gravity.svg;
}
