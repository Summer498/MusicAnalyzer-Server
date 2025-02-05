import { Gravity, IMelodyModel } from "@music-analyzer/melody-analyze";
import { CurrentTimeX, NoteSize, NowAt, black_key_prm, PianoRollBegin, NowAtX } from "@music-analyzer/view-parameters";
import { HierarchyLevel } from "@music-analyzer/controllers";
import { AccompanyToAudio } from "@music-analyzer/view";

const triangle_width = 5;
const triangle_height = 5;

type Vector2D = {
  readonly x: number;
  readonly y: number;
}

export class ArrowSVG implements AccompanyToAudio {
  readonly svg: SVGGElement;
  readonly begin: number;
  readonly end: number;
  readonly note?: number;
  readonly destination?: number;
  readonly layer: number;
  readonly src: Vector2D;
  readonly dst: Vector2D;
  readonly hierarchy_level: HierarchyLevel;

  constructor(melody: IMelodyModel, next: IMelodyModel, gravity: Gravity, fill: string, stroke: string, hierarchy_level: HierarchyLevel, layer?: number) {
    const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    triangle.classList.add("triangle");
    triangle.id = "gravity-arrow";
    triangle.style.stroke = stroke;
    triangle.style.strokeWidth = String(5);
    triangle.style.fill = fill;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.id = "gravity-arrow";
    line.classList.add("line");
    line.style.stroke = stroke;
    line.style.strokeWidth = String(5);

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.svg.id = "gravity";
    this.svg.appendChild(triangle);
    this.svg.appendChild(line);
    this.begin = melody.begin;
    this.end = melody.end;
    this.note = melody.note;
    this.destination = gravity.destination;
    this.layer = layer || 0;
    this.src = {
      x: (melody.end - melody.begin) / 2 + melody.begin,
      y: melody.note === undefined ? -99 : (PianoRollBegin.value + 0.5 - melody.note) * black_key_prm.height
    };
    this.dst = {
      x: next.begin,
      y: (PianoRollBegin.value + 0.5 - gravity.destination!) * black_key_prm.height
    };
    this.hierarchy_level = hierarchy_level;
  }
  onAudioUpdate() {
    const src: Vector2D = {
      x: CurrentTimeX.value + this.src.x * NoteSize.value - NowAtX.value,
      y: this.src.y
    };
    const dst: Vector2D = {
      x: CurrentTimeX.value + this.dst.x * NoteSize.value - NowAtX.value,
      y: this.dst.y
    };

    const dx = dst.x - src.x;
    const dy = dst.y - src.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    const cos = -dy / r;
    const sin = dx / r;
    const p = [
      dst.x,
      dst.y,
      dst.x + cos * triangle_width - sin * triangle_height,
      dst.y + sin * triangle_width + cos * triangle_height,
      dst.x + cos * -triangle_width - sin * triangle_height,
      dst.y + sin * -triangle_width + cos * triangle_height
    ];
    const is_visible = this.hierarchy_level.range.value === `${this.layer}`;
    this.svg.style.visibility = is_visible ? "visible" : "hidden";
    for (const e of this.svg.getElementsByClassName("triangle") as HTMLCollectionOf<SVGPolygonElement>) {
      e.setAttribute("points", p.join(","));
    }
    for (const e of this.svg.getElementsByClassName("line") as HTMLCollectionOf<SVGLineElement>) {
      e.setAttribute("x1", `${src.x}`);
      e.setAttribute("x2", `${dst.x}`);
      e.setAttribute("y1", `${src.y}`);
      e.setAttribute("y2", `${dst.y}`);
    }
  }
}
